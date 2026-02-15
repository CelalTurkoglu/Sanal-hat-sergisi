import Link from "next/link";
import Image from "next/image";

import { getStats } from "@/lib/stats";
import styles from "./page.module.css";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const stats = await getStats();

  return (
    <main className={styles.main}>
      {/* Poster / Banner Section */}
      <section className={styles.posterSection}>
        <div className={styles.posterWrapper}>
          <Image
            src="/afis.jpeg"
            alt="Rahmet Ayında Aile — Hüsn-ü Hat Sergisi Afişi"
            width={800}
            height={1100}
            priority
            className={styles.posterImage}
          />
        </div>
      </section>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          {/* Decorative element */}
          <div className={styles.decorativeTop}>✦</div>

          {/* Main title */}
          <h1 className={styles.title}>
            Hüsn-ü Hat
            <span className={styles.titleAccent}>Sergisi</span>
          </h1>

          {/* Subtitle */}
          <p className={styles.subtitle}>
            &ldquo;Rahmet Ayında Aile&rdquo;
          </p>
          <p className={styles.subtitleSmall}>
            Geleneksel hat sanatının ışığında, kadim harflerin
            modern dünyayla buluştuğu bir yolculuk
          </p>

          {/* Decorative divider */}
          <div className={styles.divider}>
            <span className={styles.dividerLine}></span>
            <span className={styles.dividerIcon}>❋</span>
            <span className={styles.dividerLine}></span>
          </div>

          {/* Exhibition highlight */}
          <div className={styles.heroInfo}>
            <p className={styles.heroInfoItem}>
              <span className={styles.heroInfoLabel}>Tarih</span>
              <span className={styles.heroInfoValue}>18 Şubat Çarşamba</span>
            </p>
            <div className={styles.heroInfoDivider}></div>
            <p className={styles.heroInfoItem}>
              <span className={styles.heroInfoLabel}>Saat</span>
              <span className={styles.heroInfoValue}>11:00</span>
            </p>
            <div className={styles.heroInfoDivider}></div>
            <p className={styles.heroInfoItem}>
              <span className={styles.heroInfoLabel}>Yer</span>
              <span className={styles.heroInfoValue}>İstanbul İl Milli Eğitim Müdürlüğü Sergi Salonu</span>
            </p>
          </div>

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

      {/* Exhibition Info Section */}
      <section className={styles.exhibitionInfo}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Sergi Bilgileri</h2>

          <div className={styles.exhibitionSingle}>
            <div className={styles.exhibitionCard}>
              <h3 className={styles.exhibitionName}>&ldquo;Rahmet Ayında Aile&rdquo;</h3>
              <p className={styles.exhibitionTheme}>Hüsn-ü Hat Sergisi</p>

              <div className={styles.exhibitionHighlight}>
                <div className={styles.highlightItem}>
                  <div className={styles.highlightContent}>
                    <span className={styles.highlightLabel}>Tarih</span>
                    <span className={styles.highlightValue}>18 Şubat Çarşamba</span>
                  </div>
                </div>
                <div className={styles.highlightDivider}></div>
                <div className={styles.highlightItem}>
                  <div className={styles.highlightContent}>
                    <span className={styles.highlightLabel}>Saat</span>
                    <span className={styles.highlightValue}>11:00</span>
                  </div>
                </div>
                <div className={styles.highlightDivider}></div>
                <div className={styles.highlightItem}>
                  <div className={styles.highlightContent}>
                    <span className={styles.highlightLabel}>Yer</span>
                    <span className={styles.highlightValue}>İstanbul İl Milli Eğitim Müdürlüğü Sergi Salonu</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className={styles.about}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Sergi Hakkında</h2>

          <div className={styles.aboutContent}>
            <p className={styles.aboutText}>
              İstanbul İl Milli Eğitim Müdürlüğü tarafından düzenlenen bu sergi,
              yüzyıllardır süregelen hat sanatı geleneğinin özünü koruyarak,
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
          © 2025 Hüsn-ü Hat Sergisi | İstanbul İl Milli Eğitim Müdürlüğü
        </p>
      </footer>
    </main>
  );
}
