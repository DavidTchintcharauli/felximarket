"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import toast from "react-hot-toast";

export default function SubscribePage() {
    const { user } = useAuth();
    const router = useRouter();
    const [isPremium, setIsPremium] = useState(false);

    useEffect(() => {
        if (!user) return;
        const checkPremium = async () => {
            const { data } = await supabase
                .from("premium_users")
                .select("user_id")
                .eq("user_id", user.id)
                .maybeSingle();

            if (data) {
                setIsPremium(true);
            }
        };

        checkPremium();
    }, [user]);

    const handleSubscribe = async () => {
        if (!user) {
            toast.error("You must be logged in to subscribe.");
            return;
        }
        
        const response = await fetch("/api/create-premium-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id }),
        });

        const data = await response.json();
        if (data.url) {
            window.location.href = data.url;
        } else {
            toast.error("Failed to create Stripe session.");
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-32 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Premium Subscription</h1>

            {isPremium ? (
                <p className="text-green-500 text-xl">✅ You already have a premium subscription!</p>
            ) : (
                <>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">Unlock premium features for just $100.</p>
                    <button
                        onClick={handleSubscribe}
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                    >
                        Buy Premium – $100
                    </button>
                </>
            )}
        </div>
    );
}
