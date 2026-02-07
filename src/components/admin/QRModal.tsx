'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './QRModal.module.css'

interface QRModalProps {
    artworkId: string
    artworkTitle: string
    onClose: () => void
}

export default function QRModal({ artworkId, artworkTitle, onClose }: QRModalProps) {
    const [qrData, setQrData] = useState<{ qrCode: string; url: string } | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Fetch QR code on mount
    useEffect(() => {
        fetch(`/api/artworks/${artworkId}/qr`)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    setError(data.error)
                } else {
                    setQrData(data)
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

    const handlePrint = () => {
        if (!qrData) return

        const printWindow = window.open('', '_blank')
        if (printWindow) {
            printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>QR Kod - ${artworkTitle}</title>
            <style>
              body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                font-family: sans-serif;
              }
              img { max-width: 300px; }
              h2 { margin-top: 20px; font-size: 18px; }
              p { color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <img src="${qrData.qrCode}" alt="QR Code" />
            <h2>${artworkTitle}</h2>
            <p>${qrData.url}</p>
          </body>
        </html>
      `)
            printWindow.document.close()
            printWindow.print()
        }
    }

    return (
        <div className={styles.overlay} onClick={onClose}>
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
                            <button className={styles.downloadBtn} onClick={handleDownload}>
                                📥 İndir
                            </button>
                            <button className={styles.printBtn} onClick={handlePrint}>
                                🖨️ Yazdır
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
