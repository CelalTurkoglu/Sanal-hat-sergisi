import Link from "next/link";
import Image from "next/image";
export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import styles from "./page.module.css";

const ITEMS_PER_PAGE = 20;

async function getArtworks(page: number) {
    const skip = (page - 1) * ITEMS_PER_PAGE;
    const [artworks, total] = await Promise.all([
        prisma.artwork.findMany({
            where: { isPublished: true },
            orderBy: { order: "asc" },
            skip,
            take: ITEMS_PER_PAGE,
        }),
        prisma.artwork.count({
            where: { isPublished: true },
        }),
    ]);
    return { artworks, total, totalPages: Math.ceil(total / ITEMS_PER_PAGE) };
}

export const metadata = {
    title: "Galeri | Hüsn-ü Hat Sergisi",
    description: "Rahmet Ayında Aile — Hüsn-ü Hat Sergisi eserlerini keşfedin",
};

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | 'ellipsis')[] = [];
    pages.push(1);
    if (current > 3) pages.push('ellipsis');
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current < total - 2) pages.push('ellipsis');
    pages.push(total);
    return pages;
}

export default async function GalleryPage({
    searchParams,
}: {
    searchParams: { page?: string };
}) {
    const currentPage = Math.max(1, parseInt(searchParams.page || '1', 10));
    const { artworks, total, totalPages } = await getArtworks(currentPage);

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
                        Sergideki tüm eserleri keşfedin ({total} eser)
                    </p>
                </div>
            </section>

            {/* Gallery Grid */}
            <section className={styles.gallerySection}>
                <div className="container">
                    {artworks.length > 0 ? (
                        <>
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
                                                width={800}
                                                height={1000}
                                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                                                className={styles.cardImage}
                                                style={{ width: '100%', height: 'auto' }}
                                            />
                                        </div>
                                        <div className={styles.cardContent}>
                                            <p className={styles.cardArtist}>{artwork.artist}</p>
                                            <h3 className={styles.cardTitle}>{artwork.title}</h3>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <nav className={styles.pagination}>
                                    <Link
                                        href={`/gallery?page=${currentPage - 1}`}
                                        className={currentPage <= 1 ? styles.pageLinkDisabled : styles.pageLink}
                                        aria-label="Önceki sayfa"
                                    >
                                        ‹
                                    </Link>

                                    {getPageNumbers(currentPage, totalPages).map((item, i) =>
                                        item === 'ellipsis' ? (
                                            <span key={`e${i}`} className={styles.pageEllipsis}>…</span>
                                        ) : (
                                            <Link
                                                key={item}
                                                href={`/gallery?page=${item}`}
                                                className={item === currentPage ? styles.pageLinkActive : styles.pageLink}
                                            >
                                                {item}
                                            </Link>
                                        )
                                    )}

                                    <Link
                                        href={`/gallery?page=${currentPage + 1}`}
                                        className={currentPage >= totalPages ? styles.pageLinkDisabled : styles.pageLink}
                                        aria-label="Sonraki sayfa"
                                    >
                                        ›
                                    </Link>
                                </nav>
                            )}
                        </>
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
