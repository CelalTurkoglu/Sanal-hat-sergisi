import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import styles from "./page.module.css";

interface PageProps {
    params: Promise<{ id: string }>;
}

async function getArtwork(id: string) {
    const artwork = await prisma.artwork.findUnique({
        where: { id },
    });
    return artwork;
}

async function getAdjacentArtworks(currentOrder: number) {
    const [prev, next] = await Promise.all([
        prisma.artwork.findFirst({
            where: { order: { lt: currentOrder }, isPublished: true },
            orderBy: { order: "desc" },
            select: { id: true, title: true },
        }),
        prisma.artwork.findFirst({
            where: { order: { gt: currentOrder }, isPublished: true },
            orderBy: { order: "asc" },
            select: { id: true, title: true },
        }),
    ]);
    return { prev, next };
}

export async function generateMetadata({ params }: PageProps) {
    const { id } = await params;
    const artwork = await getArtwork(id);

    if (!artwork) {
        return { title: "Eser Bulunamadı" };
    }

    return {
        title: `${artwork.title} | Hüsn-ü Hat Sergisi`,
        description: artwork.meaning.substring(0, 160),
        openGraph: {
            title: artwork.title,
            description: artwork.meaning.substring(0, 160),
            images: [artwork.imageUrl],
        },
    };
}

export default async function ArtworkPage({ params }: PageProps) {
    const { id } = await params;
    const artwork = await getArtwork(id);

    if (!artwork || !artwork.isPublished) {
        notFound();
    }

    const { prev, next } = await getAdjacentArtworks(artwork.order);

    return (
        <main className={styles.main}>
            {/* Back Navigation */}
            <nav className={styles.nav}>
                <Link href="/gallery" className={styles.backButton}>
                    <span className={styles.backIcon}>←</span>
                    <span>Galeriye Dön</span>
                </Link>
            </nav>

            {/* Artwork Image */}
            <section className={styles.imageSection}>
                <div className={styles.imageWrapper}>
                    <Image
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        fill
                        priority
                        sizes="100vw"
                        className={styles.image}
                    />
                </div>
            </section>

            {/* Artwork Content */}
            <section className={styles.contentSection}>
                <div className={styles.content}>
                    {/* Title */}
                    <h1 className={styles.title}>{artwork.title}</h1>

                    {/* Decorative Divider */}
                    <div className={styles.divider}>
                        <span className={styles.dividerLine}></span>
                        <span className={styles.dividerIcon}>✦</span>
                        <span className={styles.dividerLine}></span>
                    </div>

                    {/* Arabic Text */}
                    <div className={styles.arabicWrapper}>
                        <p className={styles.arabicText}>{artwork.arabicText}</p>
                    </div>

                    {/* Turkish Meaning */}
                    <div className={styles.meaningSection}>
                        <h2 className={styles.sectionLabel}>Türkçe Meali</h2>
                        <p className={styles.meaningText}>{artwork.meaning}</p>
                    </div>

                    {/* Description */}
                    {artwork.description && (
                        <div className={styles.descriptionSection}>
                            <h2 className={styles.sectionLabel}>Açıklama</h2>
                            <p className={styles.descriptionText}>{artwork.description}</p>
                        </div>
                    )}

                    {/* Artist */}
                    <div className={styles.artistSection}>
                        <span className={styles.artistLabel}>Hattat</span>
                        <span className={styles.artistName}>{artwork.artist}</span>
                    </div>

                    {/* Navigation */}
                    <div className={styles.navigationSection}>
                        {prev ? (
                            <Link href={`/artwork/${prev.id}`} className={styles.navLink}>
                                <span className={styles.navArrow}>←</span>
                                <span className={styles.navText}>Önceki</span>
                            </Link>
                        ) : (
                            <div></div>
                        )}

                        <Link href="/gallery" className={styles.galleryLink}>
                            Tüm Eserler
                        </Link>

                        {next ? (
                            <Link href={`/artwork/${next.id}`} className={styles.navLink}>
                                <span className={styles.navText}>Sonraki</span>
                                <span className={styles.navArrow}>→</span>
                            </Link>
                        ) : (
                            <div></div>
                        )}
                    </div>
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
