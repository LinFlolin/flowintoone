import type { Database } from "@/types/supabase";

export type Shops = Database["public"]["Tables"]["shops"]["Row"];
export type ShopInsert = Database['public']['Tables']['shops']['Insert'];
export type ShopUpdate = Database['public']['Tables']['shops']['Update'];

