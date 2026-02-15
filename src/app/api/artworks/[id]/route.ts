import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'
import { deleteImage } from '@/lib/image'

interface RouteParams {
    params: Promise<{ id: string }>
}

// GET single artwork
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params

        const artwork = await prisma.artwork.findUnique({
            where: { id },
        })

        if (!artwork) {
            return NextResponse.json(
                { error: 'Eser bulunamadı' },
                { status: 404 }
            )
        }

        return NextResponse.json(artwork)
    } catch (error) {
        console.error('Error fetching artwork:', error)
        return NextResponse.json(
            { error: 'Eser yüklenirken bir hata oluştu' },
            { status: 500 }
        )
    }
}

// PUT update artwork
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const authenticated = await isAuthenticated()
        if (!authenticated) {
            return NextResponse.json(
                { error: 'Yetkisiz erişim' },
                { status: 401 }
            )
        }

        const { id } = await params
        const data = await request.json()

        const existingArtwork = await prisma.artwork.findUnique({
            where: { id },
        })

        if (!existingArtwork) {
            return NextResponse.json(
                { error: 'Eser bulunamadı' },
                { status: 404 }
            )
        }

        // If image changed, delete old one
        if (data.imageUrl && data.imageUrl !== existingArtwork.imageUrl) {
            await deleteImage(existingArtwork.imageUrl, existingArtwork.thumbnail || undefined)
        }

        const artwork = await prisma.artwork.update({
            where: { id },
            data: {
                title: data.title,
                imageUrl: data.imageUrl,
                thumbnail: data.thumbnail,
                arabicText: data.arabicText,
                meaning: data.meaning,
                description: data.description,
                artist: data.artist,
                classGrade: data.classGrade || null,
                order: data.order ? parseInt(data.order, 10) : undefined,
                isPublished: data.isPublished,
            },
        })

        return NextResponse.json(artwork)
    } catch (error) {
        console.error('Error updating artwork:', error)
        return NextResponse.json(
            { error: 'Eser güncellenirken bir hata oluştu' },
            { status: 500 }
        )
    }
}

// DELETE artwork
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const authenticated = await isAuthenticated()
        if (!authenticated) {
            return NextResponse.json(
                { error: 'Yetkisiz erişim' },
                { status: 401 }
            )
        }

        const { id } = await params

        const artwork = await prisma.artwork.findUnique({
            where: { id },
        })

        if (!artwork) {
            return NextResponse.json(
                { error: 'Eser bulunamadı' },
                { status: 404 }
            )
        }

        // Delete images
        await deleteImage(artwork.imageUrl, artwork.thumbnail || undefined)

        // Delete from database
        await prisma.artwork.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting artwork:', error)
        return NextResponse.json(
            { error: 'Eser silinirken bir hata oluştu' },
            { status: 500 }
        )
    }
}
