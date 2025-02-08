"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import Link from "next/link";

type Blog = {
    id: string;
    title: string;
    content: string;
    images: string[];
    created_at: string;
    author_id: string;
    author: {
        first_name: string | null;
        last_name: string | null;
        email: string;
    };
};

export default function BlogsListPage() {
    const { user } = useAuth();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();
    const [isPremium, setIsPremium] = useState(false);

    useEffect(() => {
        if (!user) return;
        const checkPremium = async () => {
            const { data, error } = await supabase
                .from("premium_users")
                .select("user_id")
                .eq("user_id", user.id)
                .maybeSingle();

            if (data) setIsPremium(true);
        };

        checkPremium();
    }, [user]);

    const handleCreateBlog = () => {
        if (isPremium) {
            router.push("/blogs/create");
        } else {
            router.push("/subscribe");
        }
    };

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);

            const { data, error } = await supabase
                .from("blogs")
                .select(`
                    id,
                    title,
                    content,
                    images,
                    created_at,
                    author_id,
                    profiles:profiles!blogs_author_id_fkey(first_name, last_name, email)
                `)
                .order("created_at", { ascending: false });

            if (error) {
                console.error("🚨 Error fetching blogs:", error);
                toast.error("Failed to fetch blogs.");
                return;
            }

            const formattedBlogs = data.map((blog: any) => {
                const author = blog.profiles
                    ? {
                          first_name: blog.profiles.first_name || null,
                          last_name: blog.profiles.last_name || null,
                          email: blog.profiles.email,
                      }
                    : { first_name: null, last_name: null, email: "Unknown Email" };

                return {
                    ...blog,
                    images: Array.isArray(blog.images) ? blog.images : [],
                    author,
                };
            });

            setBlogs(formattedBlogs);
            setLoading(false);
        };

        fetchBlogs();
    }, []);

    const handleDelete = async (blogId: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
        if (!confirmDelete) return;

        const { error } = await supabase.from("blogs").delete().eq("id", blogId);

        if (error) {
            console.error("🚨 Error deleting blog:", error);
            toast.error("Failed to delete blog.");
            return;
        }

        setBlogs(blogs.filter((blog) => blog.id !== blogId));
        toast.success("✅ Blog deleted successfully!");
    };

    const filteredBlogs = blogs.filter((blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (blog.author.first_name && blog.author.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (blog.author.last_name && blog.author.last_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="max-w-4xl mx-auto mt-32 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">Blogs</h1>

            <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg mb-4 text-gray-700"
            />

            <button onClick={handleCreateBlog} className="mb-4 inline-block bg-blue-500 text-white py-2 px-4 rounded-lg">
                ➕ Create Blog
            </button>

            {loading ? (
                <p>Loading...</p>
            ) : filteredBlogs.length === 0 ? (
                <p className="text-center text-gray-600 dark:text-gray-300">No blogs found.</p>
            ) : (
                filteredBlogs.map((blog) => (
                    <div key={blog.id} className="border-b py-4">
                        <h2 className="text-xl font-semibold">{blog.title}</h2>
                        <p className="text-gray-600">
                            By{" "}
                            {blog.author.first_name && blog.author.last_name
                                ? `${blog.author.first_name} ${blog.author.last_name}`
                                : blog.author.email}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 mt-2">{blog.content.slice(0, 100)}...</p>
                        {blog.images.length > 0 && (
                            <img src={blog.images[0]} alt="Blog Image" className="mt-2 w-40 h-40 object-cover rounded-lg" />
                        )}

                        <div className="mt-2 flex gap-4">
                            <Link href={`/blogs/${blog.id}`} className="text-blue-500 hover:underline">
                                Read More
                            </Link>

                            {user?.id === blog.author_id && (
                                <button onClick={() => handleDelete(blog.id)} className="text-red-500 hover:underline">
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
