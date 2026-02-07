import Link from "next/link";
import { getStats } from "@/lib/stats";
import styles from "./page.module.css";

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  const stats = await getStats();

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          {/* Decorative element */}
          <div className={styles.decorativeTop}>✦</div>

          {/* Main title */}
          <h1 className={styles.title}>
            Hat Sanatı
            <span className={styles.titleAccent}>Sergisi</span>
          </h1>

          {/* Subtitle */}
          <p className={styles.subtitle}>
            Geleneksel hat sanatının ışığında, kadim harflerin
            <br />
            modern dünyayla buluştuğu bir yolculuk
          </p>

          {/* Decorative divider */}
          <div className={styles.divider}>
            <span className={styles.dividerLine}></span>
            <span className={styles.dividerIcon}>❋</span>
            <span className={styles.dividerLine}></span>
          </div>

          {/* Artist name */}
          <p className={styles.artistName}>Celal</p>

          {/* CTA Button */}
          <Link href="/gallery" className={styles.ctaButton}>
            Eserleri Keşfet
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className={styles.scrollIndicator}>
          <span className={styles.scrollText}>Aşağı Kaydır</span>
          <span className={styles.scrollArrow}>↓</span>
        </div>
      </section>

      {/* About Section */}
      <section className={styles.about}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Sergi Hakkında</h2>

          <div className={styles.aboutContent}>
            <p className={styles.aboutText}>
              Bu sergi, yüzyıllardır süregelen hat sanatı geleneğinin özünü koruyarak,
              kutsal metinleri ve hikmetli sözleri çağdaş bir yorumla sunar. Her bir eser,
              mürekkebin kâğıtla buluştuğu o özel anı yakalamak için titizlikle hazırlanmıştır.
            </p>

            <p className={styles.aboutText}>
              {stats.totalArtworks > 0
                ? `${stats.totalArtworks} eserin yer aldığı bu koleksiyon, Kur'an-ı Kerim ayetlerinden hadis-i şeriflere,
                   hikmetli sözlerden dualara kadar geniş bir yelpazede, hat sanatının inceliklerini
                   ve güzelliklerini gözler önüne serer.`
                : `Koleksiyonumuzda Kur'an-ı Kerim ayetlerinden hadis-i şeriflere,
                   hikmetli sözlerden dualara kadar geniş bir yelpazede, hat sanatının inceliklerini
                   ve güzelliklerini gözler önüne seren eserler yer almaktadır.`
              }
            </p>
          </div>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{stats.totalArtworks || '—'}</span>
              <span className={styles.statLabel}>Eser</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{stats.totalArtists || '—'}</span>
              <span className={styles.statLabel}>Hattat</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>∞</span>
              <span className={styles.statLabel}>İlham</span>
            </div>
          </div>
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
