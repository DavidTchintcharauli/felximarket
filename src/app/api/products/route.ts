import { supabase } from "../../utils/supabase/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, description, price, user_id } = await req.json();

    if (!name || !price || !user_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("products")
      .insert([{ name, description, price, user_id }]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
