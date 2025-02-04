import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// ✅ გამოიყენე მხოლოდ სერვერზე! (RLS-ს გვერდს აუვლის)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE! // ✅ Service Role გამოიყენე, რათა RLS არ მოქმედებდეს
);

export async function POST(req: Request) {
  try {
    const { name, description, price, images, user_id } = await req.json();

    if (!name || !price || !user_id || !images || images.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ შეცვალე `supabase` → `supabaseAdmin`
    const { data, error } = await supabaseAdmin
      .from("products")
      .insert([{ name, description, price, images, user_id }])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
