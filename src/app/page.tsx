import Link from "next/link";
import Image from "next/image";

import { prisma } from "@/lib/prisma";
import { getStats } from "@/lib/stats";
import ArtworkSlider from "@/components/public/ArtworkSlider";
import styles from "./page.module.css";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const [stats, sliderArtworks] = await Promise.all([
    getStats(),
    prisma.artwork.findMany({
      where: { isPublished: true },
      orderBy: { order: 'asc' },
      select: { id: true, thumbnail: true, imageUrl: true },
    }),
  ]);

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
              <span className={styles.heroInfoValue}>18 Şubat - 9 Mart 2026</span>
            </p>
            <div className={styles.heroInfoDivider}></div>
            <p className={styles.heroInfoItem}>
              <span className={styles.heroInfoLabel}>Yer</span>
              <span className={styles.heroInfoValue}>İstanbul İl Milli Eğitim Müdürlüğü Sergi Salonu</span>
            </p>
          </div>

        </div>
      </section>

      {/* About Section */}
      <section className={styles.about}>
        <div className="container">
          <div className={styles.sectionDecor}>✦</div>
          <div className={styles.aboutContent}>
            <h3 className={styles.aboutHeading}>
              &ldquo;Rahmet Ayında Aile Hüsn-ü Hat Sergisi&rdquo;
            </h3>

            <p className={styles.aboutLead}>
              Aile; merhametin, rahmetin ve medeniyet tasavvurunun başladığı ilk mekteptir.
            </p>

            <p className={styles.aboutText}>
              Okulumuz Güzelyurt Kız Anadolu İmam Hatip Lisesi öğrenci ve öğretmenleri tarafından
              hattat Üstad Abdülkadir Geylani riyasetinde Ramazan ayının manevi iklimine hasretle
              hazırlanan bu sergi, Kur&apos;an-ı Kerim&apos;de yer alan aile ile ilgili ayet-i kerimeleri
              ve ailenin önemini ifade eden hadis-i şerifleri hüsn-ü hat sanatının zarif çizgileriyle
              buluşturmayı amaçlamıştır.
            </p>

            <p className={styles.aboutText}>
              Kadim geleneğimizin estetik dili olan Hüsnü-ü hat sanatı; sabrı, inceliği ve derinliği
              temsil eder. Bu sergide yer alan her bir eser, sadece bir yazı değil; aynı zamanda
              bir mesaj, bir değer, bir dua ve bir gönül niyazıdır.
            </p>

            <p className={styles.aboutText}>
              &ldquo;Rahmet Ayında Aile&rdquo; temasıyla hazırlanan bu çalışma; aile bağlarının
              güçlenmesine, birlik ve beraberliğin hatırlanmasına ve medeniyetimizin temel taşı
              olan aile kavramının sanat yoluyla yeniden tefekkür edilmesine katkı sunmayı
              hedeflemektedir.
            </p>

            <p className={styles.aboutInvitation}>
              Harflerin zarafetinde saklı hikmeti keşfetmeye davetlisiniz.
            </p>
          </div>

          <div className={styles.aboutSignature}>
            <span className={styles.signatureName}>Gökçen GÜL KÜRTÜNLÜ</span>
            <span className={styles.signatureRole}>Okul Müdürü</span>
          </div>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{stats.totalArtworks || '—'}</span>
              <span className={styles.statLabel}>Eser</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{stats.totalArtists || '—'}</span>
              <span className={styles.statLabel}>Hat Öğrencisi</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>∞</span>
              <span className={styles.statLabel}>İlham</span>
            </div>
          </div>

          <ArtworkSlider artworks={sliderArtworks} />

          <div className={styles.aboutCta}>
            <Link href="/gallery" className={styles.ctaButton}>
              Eserleri Keşfet
            </Link>
          </div>
        </div>
      </section>

      {/* Teacher Bio Section */}
      <section className={styles.teacherBio}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Hattat Hakkında</h2>

          <div className={styles.teacherCard}>
            <h3 className={styles.teacherName}>Abdülkader bin Ali El-Cevlanî</h3>
            <p className={styles.teacherTitle}>Hat Sanatı Üstadı</p>
            <div className={styles.teacherDivider}></div>

            <div className={styles.teacherDetail}>
              <span className={styles.teacherDetailLabel}>Doğum Yılı:</span>
              <span className={styles.teacherDetailValue}>1966</span>
            </div>

            <p className={styles.teacherText}>
              Şam&apos;da eğitim gördü ve tüm eğitim seviyelerini tamamladı.
              1989 yılında dört yıllık eğitimden sonra Güzel Sanatlar Enstitüsü&apos;nden mezun oldu.
            </p>

            <p className={styles.teacherText}>
              35 yıl boyunca Şam&apos;daki ortaokullarda ve Güzel Sanatlar Enstitüsü ve Güzel Sanatlar
              Fakültesi&apos;nde hat sanatı ve İslami süsleme sanatı dersleri verdi. Şam, Almanya,
              Suudi Arabistan ve diğer Arap şehir ve ülkelerinde çeşitli sergiler açtı.
            </p>

            <p className={styles.teacherText}>
              10 yıldır Türkiye&apos;de yaşıyor. İstanbul&apos;da da farklı tarihlerde Halk Eğitim
              Merkezlerinde ve farklı okullarda hat sanatı öğretmeni olarak çalıştı ve çeşitli
              sergiler açtı. Halen İstanbul Esenyurt Güzelyurt KAİHL&apos;nin öğretmen ve
              öğrencilerine hüsn-ü hat dersi vermektedir.
            </p>
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
