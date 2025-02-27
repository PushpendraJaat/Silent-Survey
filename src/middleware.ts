import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export { default } from "next-auth/middleware"
import { getToken } from 'next-auth/jwt'


export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request })
    const url = request.nextUrl

    if (token &&
        (
            url.pathname.startsWith('/signin') ||
            url.pathname.startsWith('/signup') ||
            url.pathname.startsWith('/') ||
            url.pathname.startsWith('verify-email')
        )
    ) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    //return NextResponse.redirect(new URL('/home', request.url))
}


export const config = {
    matcher: [
        '/signin',
        '/signup',
        '/',
        '/verify-email/:path*',
        '/dashboard/:path*', // Matches any path after /dashboard
    ]
}