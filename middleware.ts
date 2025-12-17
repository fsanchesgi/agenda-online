import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let response = NextResponse.next()

  const supabase = createServerClient(
    'https://uqwbduinwugaqexsvkxc.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthPage = req.nextUrl.pathname.startsWith('/login')
  const isDashboard = req.nextUrl.pathname.startsWith('/dashboard')

  // ❌ Não logado tentando acessar dashboard
  if (!user && isDashboard) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // ✅ Logado tentando acessar login
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}
