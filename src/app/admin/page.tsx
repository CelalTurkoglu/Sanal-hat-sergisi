import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'
import LogoutButton from './LogoutButton'
import ArtworkList from '@/components/admin/ArtworkList'

async function getStats() {
    const [total, published, draft, artists] = await Promise.all([
        prisma.artwork.count(),
        prisma.artwork.count({ where: { isPublished: true } }),
        prisma.artwork.count({ where: { isPublished: false } }),
        prisma.artwork.findMany({
            select: { artist: true },
            distinct: ['artist'],
        }),
    ])
    return { total, published, draft, artistCount: artists.length }
}

async function getArtworks() {
    return await prisma.artwork.findMany({
        orderBy: { order: 'asc' },
        select: {
            id: true,
            title: true,
            imageUrl: true,
            thumbnail: true,
            artist: true,
            isPublished: true,
        },
    })
}

export default async function AdminDashboard() {
    const authenticated = await isAuthenticated()

    if (!authenticated) {
        redirect('/admin/login')
    }

    const [stats, artworks] = await Promise.all([getStats(), getArtworks()])

    return (
        <>
            {/* Header */}
            <header className="admin-header">
                <span className="admin-logo">Admin Panel</span>
                <nav className="admin-nav">
                    <Link href="/" className="admin-nav-link" target="_blank">
                        Siteyi Görüntüle
                    </Link>
                    <LogoutButton />
                </nav>
            </header>

            {/* Content */}
            <main className="admin-content">
                <h1 className="admin-title">Hoş Geldiniz</h1>
                <p className="admin-subtitle">Hat Sanatı Sergisi yönetim paneli</p>

                {/* Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-value">{stats.total}</div>
                        <div className="stat-label">Toplam Eser</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{stats.published}</div>
                        <div className="stat-label">Yayında</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{stats.draft}</div>
                        <div className="stat-label">Taslak</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{stats.artistCount}</div>
                        <div className="stat-label">Hattat</div>
                    </div>
                </div>

                {/* Actions */}
                <div className="admin-actions">
                    <Link href="/admin/artwork/new" className="admin-btn-primary">
                        + Yeni Eser Ekle
                    </Link>
                </div>

                {/* Artwork List */}
                <ArtworkList artworks={artworks} />
            </main>
        </>
    )
}
