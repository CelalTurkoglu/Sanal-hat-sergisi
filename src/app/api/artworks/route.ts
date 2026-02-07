import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'

// GET all artworks
export async function GET() {
    try {
        const artworks = await prisma.artwork.findMany({
            orderBy: { order: 'asc' },
        })

        return NextResponse.json(artworks)
    } catch (error) {
        console.error('Error fetching artworks:', error)
        return NextResponse.json(
            { error: 'Eserler yüklenirken bir hata oluştu' },
            { status: 500 }
        )
    }
}

// POST create new artwork
export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const authenticated = await isAuthenticated()
        if (!authenticated) {
            return NextResponse.json(
                { error: 'Yetkisiz erişim' },
                { status: 401 }
            )
        }

        const data = await request.json()

        // Validate required fields
        const requiredFields = ['title', 'imageUrl', 'arabicText', 'meaning', 'artist']
        for (const field of requiredFields) {
            if (!data[field]) {
                return NextResponse.json(
                    { error: `${field} alanı zorunludur` },
                    { status: 400 }
                )
            }
        }

        // Get next order number
        const lastArtwork = await prisma.artwork.findFirst({
            orderBy: { order: 'desc' },
            select: { order: true },
        })
        const nextOrder = (lastArtwork?.order ?? 0) + 1

        const artwork = await prisma.artwork.create({
            data: {
                title: data.title,
                imageUrl: data.imageUrl,
                thumbnail: data.thumbnail || null,
                arabicText: data.arabicText,
                meaning: data.meaning,
                description: data.description || null,
                artist: data.artist,
                order: data.order ? parseInt(data.order, 10) : nextOrder,
                isPublished: data.isPublished ?? true,
            },
        })

        return NextResponse.json(artwork, { status: 201 })
    } catch (error) {
        console.error('Error creating artwork:', error)
        return NextResponse.json(
            { error: 'Eser oluşturulurken bir hata oluştu' },
            { status: 500 }
        )
    }
}
