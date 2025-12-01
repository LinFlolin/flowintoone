// src/api/shops_api.ts
import { supabase } from "./client";
import type { Shops } from "@/types/shop";

export async function shopApi(): Promise<{
  shops: Shops[];
  error: Error | null;
}> {
  const { data, error } = await supabase
    .from("shops")
    .select("*")
    .returns<Shops[]>(); 

  return { shops: data ?? [], error };
}
