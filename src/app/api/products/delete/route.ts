import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Supabase Admin Client (Service Role) - საჭიროა RLS-ის გვერდის ავლისთვის
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

export async function DELETE(req: Request) {
  try {
    const { productId, userId } = await req.json();

    // ✅ 1. Input Validation - UUID უნდა იყოს სწორი
    if (!/^[0-9a-fA-F-]{36}$/.test(productId) || !/^[0-9a-fA-F-]{36}$/.test(userId)) {
      return NextResponse.json({ error: "Invalid UUID format" }, { status: 400 });
    }

    console.log("🗑 Deleting product:", productId, "by user:", userId);

    // ✅ 2. შეამოწმე, მართლა ეკუთვნის თუ არა ეს პროდუქტი ამ მომხმარებელს
    const { data: product, error: fetchError } = await supabaseAdmin
      .from("products")
      .select("user_id")
      .eq("id", productId)
      .single();

    if (fetchError) {
      console.error("❌ Product fetch error:", fetchError);
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (!product || product.user_id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // ✅ 3. პროდუქტის წაშლა
    const { error: deleteError } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", productId);

    if (deleteError) {
      console.error("❌ Failed to delete product:", deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    console.log("✅ Product deleted successfully:", productId);
    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("❌ Internal Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
