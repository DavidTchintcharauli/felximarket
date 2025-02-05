"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useRouter, useParams } from "next/navigation";
import { useCart } from "../../context/CartContext";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
};

export default function ProductDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching product:", error);
        router.push("/products"); // თუ პროდუქტი არ არსებობს, აბრუნებს products გვერდზე
        return;
      }

      setProduct(data);
      setLoading(false);
    };

    fetchProduct();
  }, [id, router]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-xl">Loading...</div>;
  }

  if (!product) {
    return <div className="flex justify-center items-center min-h-screen text-xl">Product not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-32 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">{product.name}</h1>

      {/* ✅ სურათების ჩვენება */}
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {product.images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${product.name} image ${index + 1}`}
            className="w-40 h-40 object-cover rounded-lg shadow"
          />
        ))}
      </div>

      <p className="text-lg text-gray-700 dark:text-gray-300 mt-4">{product.description}</p>
      <p className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">${product.price.toFixed(2)}</p>

      <button 
        className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg"
        onClick={() => addToCart(product)}
      >
        Add to Cart
      </button>

      <button 
        className="mt-4 bg-gray-500 text-white py-2 px-4 rounded-lg"
        onClick={() => router.push("/products")}
      >
        Back to Products
      </button>
    </div>
  );
}
