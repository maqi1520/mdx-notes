'use client'

import { useSupabase } from '@/app/supabase-provider'
import { getURL } from '@/utils/helpers'
import { Auth } from '@supabase/auth-ui-react'
import './auth-ui.css'

export default function AuthUI() {
  const { supabase } = useSupabase()

  return (
    <div className="flex flex-col space-y-4">
      <Auth
        supabaseClient={supabase}
        providers={['github']}
        redirectTo={`${getURL()}auth/callback`}
        magicLink={true}
        appearance={{
          extend: false,
          // Your custom classes
          className: {
            message:
              'mt-2 w-full rounded-lg border px-4 py-3 text-sm border-destructive/50 text-destructive dark:border-destructive block',
            container: 'space-y-6 mt-6 [&>div]:space-y-3 [&>div]:mb-6',
            divider: 'my-6 border-b',
            label: 'text-sm font-medium text-muted-foreground',
            anchor: 'underline text-sm leading-6 block hover:text-primary',
            button:
              'w-full flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary shadow-sm hover:bg-primary/90 hover:text-accent-foreground h-10 px-4 py-6 [&>svg]:mr-2',
            input:
              'flex w-full rounded-md border border-input bg-background px-3 py-2 leading-7 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            //..
          },
        }}
      />
    </div>
  )
}
