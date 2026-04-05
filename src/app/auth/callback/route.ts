import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')

  const supabase = await createClient()

  // OAuth callback (Google, GitHub, etc.)
  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Email confirmation or password reset callback
  if (token_hash && type) {
    await supabase.auth.verifyOtp({ token_hash, type: type as 'signup' | 'recovery' | 'email' })
  }

  return NextResponse.redirect(`${origin}/`)
}
