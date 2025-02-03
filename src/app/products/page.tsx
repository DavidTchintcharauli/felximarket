"use client";

import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  user_id: string;
  created_at: string;
};

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw new Error(error.message);
        setProducts(data ?? []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const handleDelete = async (productId: string) => {
    if (!user) {
      alert("You must be logged in to delete a product");
      return;
    }

    setDeleting(productId);

    try {
      const res = await fetch("/api/products/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, userId: user.id }),
      });

      const text = await res.text();

      console.log("API Response:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error("Invalid JSON response:", text);
        throw new Error("Unexpected response from server");
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete product");
      }

      setProducts((prev) => prev.filter((p) => p.id !== productId));
      alert("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error)
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-xl">{t("loading...")}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-32 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">{t("products")}</h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300">{t("noProductsAvailable.")}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="p-4 border rounded-lg shadow bg-white dark:bg-gray-900">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{product.name}</h2>
              <p className="text-gray-700 dark:text-gray-300">{product.description || "No description"}</p>
              <p className="mt-2 font-bold text-lg text-blue-600 dark:text-blue-400">${product.price.toFixed(2)}</p>

              <p className="text-xs text-gray-500 dark:text-gray-400">{t("owner")} {product.user_id}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t("currentUser")} {user?.id}</p>

              {user && user.id === product.user_id && (
                <button
                  onClick={() => handleDelete(product.id)}
                  disabled={deleting === product.id}
                  className={`mt-4 px-4 py-2 text-white rounded-lg transition w-full ${
                    deleting === product.id ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {deleting === product.id ? t("Deleting...") : t("delete")}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
