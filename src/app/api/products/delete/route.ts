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

    // ✅ 2. პროდუქტის გამოთხოვა (სურათების ბილიკების ჩათვლით)
    const { data: product, error: fetchError } = await supabaseAdmin
      .from("products")
      .select("user_id, images")
      .eq("id", productId)
      .single();

    if (fetchError) {
      console.error("❌ Product fetch error:", fetchError);
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (!product || product.user_id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // ✅ 3. ფოტოების წაშლა Supabase Storage-იდან
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      const filePaths = product.images.map((url: string) => {
        // 📌 თუ URL-ში არის `sign`, ვყოფთ `sign/productimage/products/` ნაწილზე
        if (url.includes("/sign/productimage/products/")) {
          const parts = url.split("/sign/productimage/products/");
          return parts.length > 1 ? `products/${parts[1].split("?")[0]}` : "";
        }
        // 📌 თუ URL უკვე public-ია, ვყოფთ `public/productimage/products/` ნაწილზე
        else if (url.includes("/public/productimage/products/")) {
          const parts = url.split("/public/productimage/products/");
          return parts.length > 1 ? `products/${parts[1]}` : "";
        }
        return "";
      }).filter(Boolean); // 📌 ვშლით ცარიელ ბილიკებს      

      console.log("🗑 Deleting images:", filePaths);

      if (filePaths.length > 0) {
        const { error: deleteImageError } = await supabaseAdmin
          .storage
          .from("productimage")
          .remove(filePaths);

        if (deleteImageError) {
          console.error("❌ Error deleting images:", deleteImageError);
          return NextResponse.json({ error: "Failed to delete images" }, { status: 500 });
        }
      }
    }

    // ✅ 4. პროდუქტის წაშლა მონაცემთა ბაზიდან
    const { error: deleteError } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", productId);

    if (deleteError) {
      console.error("❌ Failed to delete product:", deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    console.log("✅ Product and images deleted successfully:", productId);
    return NextResponse.json({ message: "Product and images deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("❌ Internal Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
