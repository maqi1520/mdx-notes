import { Database } from '@/types/database.type'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { cache } from 'react'

export const createServerSupabaseClient = cache(() =>
  createServerComponentClient<Database>({ cookies })
)

export async function getSession() {
  const supabase = createServerSupabaseClient()
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

export async function getUserDetails() {
  const supabase = createServerSupabaseClient()
  try {
    const { data: res } = await supabase.auth.getSession()
    if (!res.session?.user) return null
    const { data: userDetails } = await supabase
      .from('profiles')
      .select()
      .eq('id', res.session.user.id)
      .single()

    return userDetails
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

export async function get<T>(id: string) {
  const supabase = createServerSupabaseClient()
  try {
    const { data } = await supabase.from('posts').select().eq('id', id).single()
    return data as T
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

export async function getTemplates<T>(limit = 20): Promise<T | null> {
  const supabase = createServerSupabaseClient()
  try {
    const { data } = await supabase.from('templates').select('*').limit(limit)

    return data as T
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}
