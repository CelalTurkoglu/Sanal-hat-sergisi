import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json()

        const adminUsername = process.env.ADMIN_USERNAME || 'admin'
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

        if (username === adminUsername && password === adminPassword) {
            const session = await getSession()
            session.isLoggedIn = true
            session.username = username
            await session.save()

            return NextResponse.json({ success: true })
        }

        return NextResponse.json(
            { error: 'Geçersiz kullanıcı adı veya şifre' },
            { status: 401 }
        )
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { error: 'Bir hata oluştu' },
            { status: 500 }
        )
    }
}

export async function DELETE() {
    try {
        const session = await getSession()
        session.destroy()

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Logout error:', error)
        return NextResponse.json(
            { error: 'Bir hata oluştu' },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        const session = await getSession()

        return NextResponse.json({
            isLoggedIn: session.isLoggedIn || false,
            username: session.username || null,
        })
    } catch (error) {
        console.error('Session check error:', error)
        return NextResponse.json({ isLoggedIn: false })
    }
}
