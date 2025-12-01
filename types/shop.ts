import type { Database } from "@/types/supabase";

export type Shops = Database["public"]["Tables"]["shops"]["Row"];
