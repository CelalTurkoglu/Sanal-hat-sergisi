import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { isAuthenticated } from '@/lib/auth'

interface RouteParams {
    params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const authenticated = await isAuthenticated()
        if (!authenticated) {
            return NextResponse.json(
                { error: 'Yetkisiz erişim' },
                { status: 401 }
            )
        }

        const { id } = await params
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        const artworkUrl = `${baseUrl}/artwork/${id}`

        // Generate QR code as data URL
        const qrDataUrl = await QRCode.toDataURL(artworkUrl, {
            width: 400,
            margin: 2,
            color: {
                dark: '#1A1A1A',
                light: '#FFFFFF',
            },
            errorCorrectionLevel: 'H',
        })

        return NextResponse.json({
            qrCode: qrDataUrl,
            url: artworkUrl
        })
    } catch (error) {
        console.error('Error generating QR code:', error)
        return NextResponse.json(
            { error: 'QR kod oluşturulamadı' },
            { status: 500 }
        )
    }
}
