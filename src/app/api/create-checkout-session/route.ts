
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// ✅ 1. გადაამოწმე, არის თუ არა STRIPE_SECRET_KEY
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("🚨 STRIPE_SECRET_KEY is missing in environment variables.");
}

// ✅ 2. გადაამოწმე, არის თუ არა NEXT_PUBLIC_APP_URL
if (!process.env.NEXT_PUBLIC_APP_URL) {
  throw new Error("🚨 NEXT_PUBLIC_APP_URL is missing in environment variables.");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27.acacia",
});

export async function POST(req: NextRequest) {
  console.log("🚀 [API] /api/create-checkout-session called" + "დადსსა");

  try {
    const { cart } = await req.json();
    console.log("🛒 Cart Data:", cart);

    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const lineItems = cart.map((item: { name: string; price: number; images: string[] }) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: item.images ? [item.images[0]] : [],
        },
        unit_amount: item.price * 100,
      },
      quantity: 1,
    }));

    console.log("✅ Stripe Line Items:", lineItems);

    // ✅ 3. გადაამოწმე, არის თუ არა NEXT_PUBLIC_APP_URL
    console.log("🔗 NEXT_PUBLIC_APP_URL:", process.env.NEXT_PUBLIC_APP_URL);

    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/success`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/cancel`;

    console.log("✅ Success URL:", successUrl);
    console.log("✅ Cancel URL:", cancelUrl);

    // 🔹 Stripe Checkout სესიის შექმნა
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    console.log("✅ Checkout Session Created:", session);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("🚨 Stripe Checkout Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
