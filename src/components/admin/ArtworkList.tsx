'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import QRModal from './QRModal'

interface Artwork {
    id: string
    title: string
    imageUrl: string
    thumbnail: string | null
    artist: string
    isPublished: boolean
}

interface ArtworkListProps {
    artworks: Artwork[]
}

export default function ArtworkList({ artworks }: ArtworkListProps) {
    const [qrModal, setQrModal] = useState<{ id: string; title: string } | null>(null)

    return (
        <>
            <div className="artwork-list">
                <div className="artwork-list-header">
                    Eserler ({artworks.length})
                </div>

                {artworks.length > 0 ? (
                    artworks.map((artwork) => (
                        <div key={artwork.id} className="artwork-list-item">
                            {artwork.thumbnail ? (
                                <Image
                                    src={artwork.thumbnail}
                                    alt={artwork.title}
                                    width={60}
                                    height={75}
                                    className="artwork-list-thumb"
                                />
                            ) : (
                                <div className="artwork-list-thumb" />
                            )}

                            <div className="artwork-list-info">
                                <div className="artwork-list-title">{artwork.title}</div>
                                <div className="artwork-list-artist">{artwork.artist}</div>
                            </div>

                            <span className={`artwork-list-status ${artwork.isPublished ? 'published' : 'draft'}`}>
                                {artwork.isPublished ? 'Yayında' : 'Taslak'}
                            </span>

                            <div className="artwork-list-actions">
                                <button
                                    className="artwork-action-btn qr"
                                    onClick={() => setQrModal({ id: artwork.id, title: artwork.title })}
                                    title="QR Kod"
                                >
                                    📱
                                </button>
                                <Link href={`/admin/artwork/${artwork.id}`} className="artwork-action-btn" title="Düzenle">
                                    ✏️
                                </Link>
                                <Link href={`/artwork/${artwork.id}`} className="artwork-action-btn" target="_blank" title="Görüntüle">
                                    👁️
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <p className="empty-state-text">Henüz eser eklenmemiş.</p>
                        <Link href="/admin/artwork/new" className="admin-btn-primary">
                            İlk Eseri Ekle
                        </Link>
                    </div>
                )}
            </div>

            {qrModal && (
                <QRModal
                    artworkId={qrModal.id}
                    artworkTitle={qrModal.title}
                    onClose={() => setQrModal(null)}
                />
            )}
        </>
    )
}
