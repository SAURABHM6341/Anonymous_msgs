import { NextResponse, NextRequest } from 'next/server'
export { default } from 'next-auth/middleware'
import { getToken } from 'next-auth/jwt'
// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
    const token = await getToken({ req: request })
    const url = request.nextUrl
    if (token && (
        url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/verify') ||
        url.pathname === '/'
    )) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }
    return NextResponse.next()
}
//kha kha middleware lgega uske liye config bnao

export const config = {
    matcher: ['/sign-in',
        '/sign-up',
        '/',
        '/verify',
        '/dashboard/:path*',
        '/verify/:path*'
    ]
}