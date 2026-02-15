'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { toPng } from 'html-to-image'
import styles from './QRModal.module.css'

interface Artwork {
    id: string
    title: string
    meaning: string
    artist: string
    classGrade: string | null
}

interface QRModalProps {
    artworkId: string
    artworkTitle: string
    onClose: () => void
}

export default function QRModal({ artworkId, artworkTitle, onClose }: QRModalProps) {
    const [qrData, setQrData] = useState<{ qrCode: string; url: string } | null>(null)
    const [artwork, setArtwork] = useState<Artwork | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const cardRef = useRef<HTMLDivElement>(null)

    // Fetch QR code and artwork details on mount
    useEffect(() => {
        Promise.all([
            fetch(`/api/artworks/${artworkId}/qr`).then(res => res.json()),
            fetch(`/api/artworks/${artworkId}`).then(res => res.json())
        ])
            .then(([qrData, artworkData]) => {
                if (qrData.error) {
                    setError(qrData.error)
                } else {
                    setQrData(qrData)
                }

                if (!artworkData.error) {
                    setArtwork(artworkData)
                }
            })
            .catch(err => {
                setError('QR kod yüklenemedi')
                console.error(err)
            })
            .finally(() => setLoading(false))
    }, [artworkId])

    const handleDownload = () => {
        if (!qrData) return

        const link = document.createElement('a')
        link.href = qrData.qrCode
        link.download = `qr-${artworkTitle.replace(/\s+/g, '-').toLowerCase()}.png`
        link.click()
    }

    const handleDownloadCard = async () => {
        if (cardRef.current === null) return

        try {
            const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2, backgroundColor: 'white' })
            const link = document.createElement('a')
            link.download = `kart-${artworkTitle.replace(/\s+/g, '-').toLowerCase()}.png`
            link.href = dataUrl
            link.click()
        } catch (err) {
            console.error('Kart oluşturulamadı:', err)
        }
    }



    return (
        <div className={styles.overlay} onClick={onClose}>
            {/* Hidden card for generation */}
            <div className={styles.cardWrapper}>
                <div ref={cardRef} className={styles.infoCard}>
                    {qrData && (
                        <div className={styles.cardQr}>
                            <Image
                                src={qrData.qrCode}
                                alt="QR Code"
                                width={150}
                                height={150}
                                unoptimized
                            />
                        </div>
                    )}
                    <div className={styles.cardContent}>
                        <div className={styles.cardRow}>
                            <strong>Eser:</strong> {artwork?.title || artworkTitle}
                        </div>
                        <div className={styles.cardRow}>
                            <strong>Eser Sahibi:</strong> {artwork?.artist || 'Bilinmiyor'}
                        </div>
                        {artwork?.classGrade && (
                            <div className={styles.cardRow}>
                                <strong>Sınıf / Branş:</strong> {artwork.classGrade}
                            </div>
                        )}
                    </div>
                    <p className={styles.cardPrompt}>Detaylı bilgi için QR kodu okutunuz</p>
                </div>
            </div>

            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>×</button>

                <h2 className={styles.title}>QR Kod</h2>
                <p className={styles.subtitle}>{artworkTitle}</p>

                <div className={styles.qrContainer}>
                    {loading && <div className={styles.loading}>Yükleniyor...</div>}
                    {error && <div className={styles.error}>{error}</div>}
                    {qrData && (
                        <Image
                            src={qrData.qrCode}
                            alt={`QR kod - ${artworkTitle}`}
                            width={280}
                            height={280}
                            className={styles.qrImage}
                        />
                    )}
                </div>

                {qrData && (
                    <>
                        <p className={styles.url}>{qrData.url}</p>

                        <div className={styles.actions}>
                            <button className={styles.downloadBtn} onClick={handleDownload} title="Sadece QR Kodu İndir">
                                📥 QR İndir
                            </button>
                            <button className={styles.printBtn} onClick={handleDownloadCard} title="Bilgi Kartı Olarak İndir">
                                🎫 Kart İndir
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
