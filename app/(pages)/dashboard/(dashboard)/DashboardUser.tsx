import Link from 'next/link'
import React from 'react'
import {supabase } from '@/api/client'
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export default async function DashboardUser() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: async () => (await cookieStore).getAll(),
        setAll: () => {}, 
      },
    }
  );
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

 
  return (
    <div>
      {user?.email}
    </div>
  )
}
