import { supabase } from "../utils/supabaseClient";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    try {
        const body = await req.json().catch(() => null);
        if (!body || !body.productId || !body.userId) {
          return NextResponse.json({ error: "Missing product ID or user ID" }, { status: 400 });
        }
    
        const { productId, userId } = body;

    // ვამოწმებთ, ეკუთვნის თუ არა პროდუქტი ამ მომხმარებელს
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("user_id")
      .eq("id", productId)
      .single();

      if (fetchError) {
        console.error("Error fetching product:", fetchError);
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      
      if (!product) {
        return NextResponse.json({ error: "Product does not exist" }, { status: 404 });
      }

    if (product.user_id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // პროდუქტის წაშლა
    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
