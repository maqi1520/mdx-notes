import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function get<T>(id: string) {
  try {
    const res = await supabase.auth.getSession()

    const { data } = await supabase.from('posts').select().eq('id', id).single()

    if (!data) return null

    if (data.published) {
      return data as T
    } else if (
      data.published === false &&
      res.data.session?.user.id === data.author_id
    ) {
      return data as T
    }
    return null
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

export async function getTemplates<T>(limit = 20): Promise<T | null> {
  try {
    const { data } = await supabase
      .from('templates')
      .select('*')
      .limit(limit)
      .order('sort', { ascending: true })

    return data as T
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}
