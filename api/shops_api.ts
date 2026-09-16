// lib/shops.ts
import { supabase } from './client';
import type { ShopInsert, ShopUpdate, Shops } from '@/types/shop';

// CREATE
export async function createShop(partial: Omit<ShopInsert, 'id' | 'shopownerId'>): Promise<Shops> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('shops')
    .insert({
      ...partial,
      shopownerId: user.id, 
    })
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

// READ (get current user's shop)
export async function getMyShop(): Promise<Shops | null> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('shopownerId', user.id)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // no rows
  return data;
}

// UPDATE
export async function updateShop(id: number, patch: ShopUpdate): Promise<Shops> {
  const { data, error } = await supabase
    .from('shops')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

// DELETE
export async function deleteShop(id: number): Promise<void> {
  const { error } = await supabase.from('shops').delete().eq('id', id);
  if (error) throw error;
}
