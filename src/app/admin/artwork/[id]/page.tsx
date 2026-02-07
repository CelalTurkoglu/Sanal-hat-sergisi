import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'
import ArtworkForm from '@/components/admin/ArtworkForm'
import styles from '../new/page.module.css'

interface PageProps {
    params: Promise<{ id: string }>
}

async function getArtwork(id: string) {
    return await prisma.artwork.findUnique({
        where: { id },
    })
}

export default async function EditArtworkPage({ params }: PageProps) {
    const authenticated = await isAuthenticated()

    if (!authenticated) {
        redirect('/admin/login')
    }

    const { id } = await params
    const artwork = await getArtwork(id)

    if (!artwork) {
        notFound()
    }

    return (
        <>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <Link href="/admin" className={styles.backLink}>
                        ← Geri
                    </Link>
                    <h1 className={styles.title}>Eser Düzenle</h1>
                </div>
            </header>

            {/* Content */}
            <main className={styles.content}>
                <ArtworkForm artwork={artwork} />
            </main>
        </>
    )
}
