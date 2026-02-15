import Link from "next/link";
import Image from "next/image";
export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import styles from "./page.module.css";

async function getArtworks() {
    const artworks = await prisma.artwork.findMany({
        where: { isPublished: true },
        orderBy: { order: "asc" },
    });
    return artworks;
}

export const metadata = {
    title: "Galeri | Hüsn-ü Hat Sergisi",
    description: "Rahmet Ayında Aile — Hüsn-ü Hat Sergisi eserlerini keşfedin",
};

export default async function GalleryPage() {
    const artworks = await getArtworks();

    return (
        <main className={styles.main}>
            {/* Header */}
            <header className={styles.header}>
                <nav className={styles.nav}>
                    <Link href="/" className={styles.logo}>
                        Hüsn-ü Hat Sergisi
                    </Link>
                </nav>
            </header>

            {/* Page Title */}
            <section className={styles.titleSection}>
                <div className="container">
                    <h1 className={styles.pageTitle}>Eserler</h1>
                    <p className={styles.pageSubtitle}>
                        Sergideki tüm eserleri keşfedin
                    </p>
                </div>
            </section>

            {/* Gallery Grid */}
            <section className={styles.gallerySection}>
                <div className="container">
                    {artworks.length > 0 ? (
                        <div className={styles.grid}>
                            {artworks.map((artwork, index) => (
                                <Link
                                    key={artwork.id}
                                    href={`/artwork/${artwork.id}`}
                                    className={styles.card}
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <div className={styles.cardImageWrapper}>
                                        <Image
                                            src={artwork.thumbnail || artwork.imageUrl}
                                            alt={artwork.title}
                                            fill
                                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                            className={styles.cardImage}
                                        />
                                    </div>
                                    <div className={styles.cardContent}>
                                        <p className={styles.cardArtist}>{artwork.artist}</p>
                                        <h3 className={styles.cardTitle}>{artwork.title}</h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.empty}>
                            <p className={styles.emptyText}>Henüz eser eklenmemiş.</p>
                            <p className={styles.emptySubtext}>
                                Admin panelinden yeni eserler ekleyebilirsiniz.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <p className={styles.footerText}>
                    © 2025 Hüsn-ü Hat Sergisi | İstanbul İl Milli Eğitim Müdürlüğü
                </p>
            </footer>
        </main>
    );
}
