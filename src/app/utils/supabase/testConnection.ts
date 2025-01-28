import { supabase } from "./client";

export const testDatabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from("users").select("*").limit(1);

    if (error) {
      throw new Error(`Database connection failed: ${error.message}`);
    }

    return data;
  } catch (err: any) {
    throw new Error(`Error: ${err.message}`);
  }
};
