import { prisma } from '@/lib/prisma'

export interface Stats {
    totalArtworks: number
    totalArtists: number
    publishedArtworks: number
}

export async function getStats(): Promise<Stats> {
    const [totalArtworks, publishedArtworks, artists] = await Promise.all([
        prisma.artwork.count(),
        prisma.artwork.count({ where: { isPublished: true } }),
        prisma.artwork.findMany({
            select: { artist: true },
            distinct: ['artist'],
        }),
    ])

    return {
        totalArtworks,
        publishedArtworks,
        totalArtists: artists.length,
    }
}
