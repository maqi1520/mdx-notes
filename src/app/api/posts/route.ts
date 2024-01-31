import { createServerSupabaseClient } from '@/app/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  let response
  const supabase = createServerSupabaseClient()
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const title = searchParams.get('title')
  const page = parseInt(searchParams.get('page') || '0')
  const limit = parseInt(searchParams.get('limit') || '10')
  // Start index from 0
  const programLimit = limit - 1
  const from = page * limit
  const to = from + programLimit

  if (id) {
    response = await supabase.from('posts').select().eq('id', id).single()
  } else {
    response = await supabase
      .from('posts')
      .select()
      .ilike('title', `%${title}%`)
      .range(from, to)
  }

  return NextResponse.json(response)
}

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient()
  const data = await request.json()

  const response = await supabase.from('posts').insert(data).select().single()

  return NextResponse.json(response)
}

export async function PATCH(request: Request) {
  const supabase = createServerSupabaseClient()
  const data = await request.json()
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')!

  const response = await supabase
    .from('posts')
    .update({
      ...data,
      updated_at: new Date(),
    })
    .eq('id', id)
    .select()
    .single()

  return NextResponse.json(response)
}

export async function DELETE(request: Request) {
  const supabase = createServerSupabaseClient()
  const data = await request.json()

  const response = await supabase.from('posts').delete().eq('id', data.id)

  return NextResponse.json(response)
}
