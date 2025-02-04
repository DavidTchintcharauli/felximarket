"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { createClient } from "@supabase/supabase-js";

// Supabase Client-ის ინიციალიზაცია
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AddProductPage() {
  const { user } = useAuth();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { t } = useTranslation();

  // ფოტოების ცვლილება
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      console.log("Selected files:", files); // დაადასტურეთ, რომ ფაილები სწორად არის არჩეული
      setImages(files);
    }
  };

  const uploadImages = async (): Promise<string[] | null> => {
    const uploadedUrls: string[] = [];
  
    for (const file of images) {
      console.log("Uploading file:", file.name);
  
      if (!file.type.startsWith("image/")) {
        console.error("Only images are allowed.");
        continue;
      }
  
      if (file.size > 5 * 1024 * 1024) {
        console.error("File size exceeds 5MB limit.");
        continue;
      }
  
      const filePath = `products/${Date.now()}-${file.name}`;
      console.log("File path:", filePath);
  
      const { data, error } = await supabase.storage
        .from("productimage") // ✅ გამოიყენე შენი bucket-ის ნამდვილი სახელი!
        .upload(filePath, file);
  
      if (error) {
        console.error("Image upload failed:", error.message, error);
        return null;
      }
  
      console.log("File uploaded successfully:", data);
  
      // ✅ `getPublicUrl()`-ის სწორი გამოყენება
      const { data: publicUrlData } = supabase.storage
        .from("product")
        .getPublicUrl(filePath);
  
      if (publicUrlData?.publicUrl) {
        console.log("Public URL:", publicUrlData.publicUrl);
        uploadedUrls.push(publicUrlData.publicUrl);
      }
    }
  
    if (uploadedUrls.length === 0) {
      console.error("No images were uploaded.");
      return null;
    }
  
    return uploadedUrls;
  };  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to add a product");
      return;
    }

    setLoading(true);

    const imageUrls = await uploadImages();
    console.log("Uploaded image URLs:", imageUrls); // დაადასტურეთ, რომ imageUrls სწორად არის მიღებული

    if (!imageUrls) {
      setLoading(false);
      alert("Image upload failed.");
      return;
    }

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        images: imageUrls,
        price: parseFloat(price),
        user_id: user.id,
      }),
    });

    if (res.ok) {
      alert("Product added successfully!");
      router.push("/products");
    } else {
      const errorData = await res.json(); // მიიღეთ შეცდომის დეტალები
      console.error("API Error:", errorData); // დაბეჭდეთ შეცდომა
      alert("Failed to add product: " + errorData.error);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-32 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">{t("addProduct")}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-semibold">{t("name")}</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">{t("description")}</label>
          <textarea
            className="w-full p-2 border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block font-semibold">{t("price")} ($)</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">{t("uploadImages")}</label>
          <input
            type="file"
            multiple
            accept="image/*"
            className="w-full p-2 border rounded"
            onChange={handleImageChange}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg"
          disabled={loading}
        >
          {loading ? t("adding...") : t("addProduct")}
        </button>
      </form>
    </div>
  );
}
