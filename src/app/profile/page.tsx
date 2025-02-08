"use client";

import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const { user, isPremium } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{
    first_name: string;
    last_name: string;
    phone: string;
    birth_date: string | null;
    email: string;
  }>({
    first_name: "",
    last_name: "",
    phone: "",
    birth_date: null,
    email: user?.email || "",
  });

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user || !user.id) {
      console.warn("⚠️ No user authenticated.");
      return;
    }
  
    console.log(`🛒 Fetching profile for user: ${user.id}`);
  
    setLoading(true);
  
    const { data, error } = await supabase
      .from("profiles")
      .select("first_name, last_name, phone, birth_date, email")
      .eq("id", user.id)
      .maybeSingle();
  
    if (error) {
      console.error("🚨 Error fetching profile:", error);
      toast.error("Failed to load profile.");
    } else if (!data) {
      console.warn("🚨 Profile not found in database. Creating a new one...");
      await createDefaultProfile();
    } else {
      console.log("✅ Profile Data:", data);
      setProfile({
        first_name: data?.first_name ?? "", 
        last_name: data?.last_name ?? "",
        phone: data?.phone ?? "",
        birth_date: data?.birth_date ? data.birth_date.split("T")[0] : "",
        email: data?.email ?? user?.email ?? "",
      });
    }
    setLoading(false);
  };

  const createDefaultProfile = async () => {
    if (!user || !user.id) return;
  
    const defaultProfile = {
      id: user.id,
      first_name: "",
      last_name: "",
      phone: "",
      birth_date: null,
      email: user.email || "",
    };
  
    const { error } = await supabase.from("profiles").insert([defaultProfile]);
  
    if (error) {
      console.error("🚨 Error creating default profile:", error);
      toast.error("Failed to create profile.");
    } else {
      console.log("✅ Default profile created successfully!");
      setProfile({
        ...defaultProfile,
        birth_date: defaultProfile.birth_date ?? null,
      });
    }
  };
  

  const handleUpdateProfile = async () => {
    if (!user || !user.id || !profile.email){
      toast.error("User is not authenticated.");
      return;
    }
  
    setLoading(true);
    
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone,
        birth_date: profile.birth_date || null,
        email: profile.email,
      });
  
    if (error) {
      console.error("🚨 Error updating profile:", error);
      toast.error("Failed to update profile.");
    } else {
      toast.success("✅ Profile updated successfully!");
    }
  
    setLoading(false);
  };

  if (!hydrated) {
    return <div className="flex justify-center items-center min-h-screen text-xl">Loading...</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-32 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">Your Profile</h1>

      {hydrated && isPremium && (
        <p className="text-center text-yellow-500 font-semibold">🔥 Premium User</p>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300">First Name</label>
          <input
            type="text"
            value={profile.first_name || ""}
            onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg text-gray-700"
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">Last Name</label>
          <input
            type="text"
            value={profile.last_name || ""}
            onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
            className="w-full p-2 border text-gray-700 border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            value={profile.email || ""}
            disabled
            className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">Phone</label>
          <input
            type="tel"
            value={profile.phone || ""}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="w-full p-2 border text-gray-700 border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">Birth Date</label>
          <input
            type="date"
            value={profile.birth_date || ""}
            onChange={(e) => setProfile({ ...profile, birth_date: e.target.value })}
            className="w-full p-2 border text-gray-700 border-gray-300 rounded-lg"
          />
        </div>
        <button
          onClick={handleUpdateProfile}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </div>
  );
}
