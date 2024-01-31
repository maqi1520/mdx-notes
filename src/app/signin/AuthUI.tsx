'use client'

import { useSupabase } from '@/app/supabase-provider'
import { getURL } from '@/utils/helpers'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

export default function AuthUI() {
  const { supabase } = useSupabase()
  console.log(`${getURL()}auth/callback`)

  return (
    <div className="flex flex-col space-y-4">
      <Auth
        supabaseClient={supabase}
        providers={['github']}
        redirectTo={`${getURL()}auth/callback`}
        magicLink={true}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#0ea5e9',
              },
            },
          },
        }}
      />
    </div>
  )
}
