import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/app/utils/supabase/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data, error } = await supabase.from("your_table_name").select("*").limit(1);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
