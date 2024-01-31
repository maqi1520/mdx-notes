import { createServerSupabaseClient } from '@/app/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (session) {
    const { data } = await supabase
      .from('profiles')
      .select()
      .eq('id', session.user.id)
      .single()

    return NextResponse.json(data)
  }

  // Next Response status 401
  return new Response('unAuthorized', {
    status: 401,
  })
}
