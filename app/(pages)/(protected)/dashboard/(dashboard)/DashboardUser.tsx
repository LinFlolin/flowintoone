import Link from 'next/link'
import React from 'react'
import {supabase } from '@/api/client'
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import FormUi from '../FormUi';
import { createSupabaseServerClient } from '@/api/server';

export default async function DashboardUser() {
  const cookieStore = cookies();
  const supabase =await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

 
  return (
    <FormUi>
      {user?.email}
    </FormUi>
  )
}
