import { supabase } from "../../../utils/supabaseClient";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || !body.productId || !body.userId) {
      console.log("❌ Missing required parameters");
      return NextResponse.json({ error: "Missing product ID or user ID" }, { status: 400 });
    }

    const { productId, userId } = body;
    console.log("🔍 Attempting to delete product:", productId);

    // ვამოწმებთ, პროდუქტი არსებობს თუ არა
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("user_id")
      .eq("id", productId)
      .single();

    if (fetchError) {
      console.error("❌ Error fetching product:", fetchError);
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (!product) {
      console.warn("⚠️ Product does not exist in the database");
      return NextResponse.json({ error: "Product does not exist" }, { status: 404 });
    }

    if (product.user_id !== userId) {
      console.warn("⚠️ Unauthorized delete attempt by user:", userId);
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // პროდუქტის წაშლა
    console.log("🗑 Deleting product:", productId);
    const { error: deleteError } = await supabase
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