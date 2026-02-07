import { redirect } from 'next/navigation'
import Link from 'next/link'
import { isAuthenticated } from '@/lib/auth'
import ArtworkForm from '@/components/admin/ArtworkForm'
import styles from './page.module.css'

export default async function NewArtworkPage() {
    const authenticated = await isAuthenticated()

    if (!authenticated) {
        redirect('/admin/login')
    }

    return (
        <>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <Link href="/admin" className={styles.backLink}>
                        ← Geri
                    </Link>
                    <h1 className={styles.title}>Yeni Eser Ekle</h1>
                </div>
            </header>

            {/* Content */}
            <main className={styles.content}>
                <ArtworkForm />
            </main>
        </>
    )
}
