"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

export default function AddProductPage() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to add a product");
      return;
    }
    
    setLoading(true);

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, price: parseFloat(price), user_id: user.id, }),
    });

    if (res.ok) {
      alert("Product added successfully!");
      router.push("/products");
    } else {
      alert("Failed to add product.");
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
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg"
          disabled={loading}
        >
          {loading ? t("Adding...") : t("addProduct")}
        </button>
      </form>
    </div>
  );
}
