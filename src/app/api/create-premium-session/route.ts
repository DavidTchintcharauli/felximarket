import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "../../utils/supabaseClient";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("🚨 STRIPE_SECRET_KEY is missing in environment variables.");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27.acacia",
});

const saveSubscriptionToSupabase = async (userId: string) => {
    const { data, error } = await supabase
      .from("subscriptions")
      .insert([{ user_id: userId, status: "active" }]);
  
    if (error) {
      console.error("🚨 Error saving subscription:", error);
    } else {
      console.log("✅ Subscription saved for user:", userId);
    }
  };

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    console.log("👤 User ID:", userId);

    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/premium-success`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/cancel`;

    console.log("✅ Success URL:", successUrl);
    console.log("✅ Cancel URL:", cancelUrl);

    // 🔥 **Subscription Stripe Session**
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Premium Subscription",
            },
            recurring: {
              interval: "month",
            },
            unit_amount: 10000, // **$100 per month**
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        user_id: userId,
        type: "subscription",
      },
    });

    console.log("✅ Subscription Checkout Created:", session);

    await saveSubscriptionToSupabase(userId);

    return NextResponse.json({ url: session.url, message: "Subscription session created successfully" });
  } catch (error: any) {
    console.error("🚨 Stripe Subscription Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
