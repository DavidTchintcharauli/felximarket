"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "../utils/supabaseClient";
import { toast } from "react-hot-toast";

type CartItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);

  // 🟢 1️⃣ კალათის აღდგენა Supabase-დან ან LocalStorage-დან
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("carts")
          .select("items")
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error("Error fetching cart:", error);
        } else if (data) {
          setCart(data.items || []);
        }

        // თუ LocalStorage-ში არის კალათა, მას გადავიტანთ Supabase-ში
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          const localCart = JSON.parse(savedCart);
          if (localCart.length > 0) {
            await saveCartToSupabase(localCart);
            localStorage.removeItem("cart"); // LocalStorage-ს ვასუფთავებთ
          }
        }
      } else {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
      }
    };

    fetchCart();
  }, [user]);

  // 🟢 2️⃣ Supabase-ში კალათის განახლება
  const saveCartToSupabase = async (updatedCart: CartItem[]) => {
    if (!user) return;
  
    const { error } = await supabase
      .from("carts")
      .upsert(
        {
          user_id: user.id,
          items: JSON.stringify(updatedCart), // ✅ JSON ფორმატში ვაწვდით მონაცემს
        },
        { onConflict: "user_id" } // ✅ ეს უნდა იყოს სტრინგი, არა მასივი
      );
  
    if (error) {
      console.error("Error saving cart to Supabase:", error);
    }
  };
  

  // 🟢 3️⃣ პროდუქტის დამატება კალათაში და მისი Supabase-ში შენახვა
  const addToCart = async (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      const updatedCart = existingItem
        ? prevCart.map((cartItem) =>
            cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
          )
        : [...prevCart, { ...item, quantity: 1 }];

      if (user) {
        saveCartToSupabase(updatedCart);
      } else {
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      }

      return updatedCart;
    });

    toast.success(`✅ ${item.name} added to cart!`);
  };

  // 🟢 4️⃣ პროდუქტის წაშლა კალათიდან და მისი Supabase-ში შენახვა
  const removeFromCart = async (id: string) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== id);

      if (user) {
        saveCartToSupabase(updatedCart);
      } else {
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      }

      return updatedCart;
    });

    toast.success("🗑 Product removed from cart.");
  };

  // 🟢 5️⃣ კალათის გასუფთავება Supabase-დანაც და LocalStorage-დანაც
  const clearCart = async () => {
    setCart([]);
    if (user) {
      saveCartToSupabase([]);
    } else {
      localStorage.removeItem("cart");
    }
    toast.success("🛒 Cart cleared.");
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
