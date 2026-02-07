import Link from "next/link";
import Image from "next/image";
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
    title: "Galeri | Hat Sanatı Sergisi",
    description: "Tüm eserleri keşfedin - 40 özgün hat sanatı eseri",
};

export default async function GalleryPage() {
    const artworks = await getArtworks();

    return (
        <main className={styles.main}>
            {/* Header */}
            <header className={styles.header}>
                <nav className={styles.nav}>
                    <Link href="/" className={styles.logo}>
                        Celal
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
                                        <h3 className={styles.cardTitle}>{artwork.title}</h3>
                                        <p className={styles.cardArtist}>{artwork.artist}</p>
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
                    © 2024 Celal Hat Sanatı Sergisi
                </p>
            </footer>
        </main>
    );
}
