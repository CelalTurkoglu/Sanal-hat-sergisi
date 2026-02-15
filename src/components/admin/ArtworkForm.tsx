'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import styles from './form.module.css'

interface ArtworkFormProps {
    artwork?: {
        id: string
        title: string
        imageUrl: string
        thumbnail: string | null
        arabicText: string
        meaning: string
        description: string | null
        artist: string
        classGrade: string | null
        order: number
        isPublished: boolean
    }
}

export default function ArtworkForm({ artwork }: ArtworkFormProps) {
    const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [formData, setFormData] = useState({
        title: artwork?.title || '',
        arabicText: artwork?.arabicText || '',
        meaning: artwork?.meaning || '',
        description: artwork?.description || '',
        artist: artwork?.artist || '',
        classGrade: artwork?.classGrade || '',
        order: artwork?.order || 0,
        isPublished: artwork?.isPublished ?? true,
    })

    const [imageUrl, setImageUrl] = useState(artwork?.imageUrl || '')
    const [thumbnail, setThumbnail] = useState(artwork?.thumbnail || '')
    const [uploading, setUploading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [error, setError] = useState('')
    const [dragActive, setDragActive] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }))
    }

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }, [])

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        const files = e.dataTransfer.files
        if (files && files[0]) {
            await uploadFile(files[0])
        }
    }, [])

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files[0]) {
            await uploadFile(files[0])
        }
    }

    const uploadFile = async (file: File) => {
        setError('')
        setUploading(true)

        try {
            const formData = new FormData()
            formData.append('file', file)

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            const data = await res.json()

            if (res.ok) {
                setImageUrl(data.imageUrl)
                setThumbnail(data.thumbnail)
            } else {
                setError(data.error || 'Resim yüklenemedi')
            }
        } catch (err) {
            setError('Resim yüklenirken bir hata oluştu')
            console.error(err)
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!imageUrl) {
            setError('Lütfen bir resim yükleyin')
            return
        }

        setSaving(true)

        try {
            const payload = {
                ...formData,
                imageUrl,
                thumbnail,
            }

            const url = artwork ? `/api/artworks/${artwork.id}` : '/api/artworks'
            const method = artwork ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (res.ok) {
                router.push('/admin')
                router.refresh()
            } else {
                const data = await res.json()
                setError(data.error || 'Bir hata oluştu')
            }
        } catch (err) {
            setError('Kaydedilirken bir hata oluştu')
            console.error(err)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!artwork) return

        if (!confirm('Bu eseri silmek istediğinizden emin misiniz?')) return

        setDeleting(true)

        try {
            const res = await fetch(`/api/artworks/${artwork.id}`, {
                method: 'DELETE',
            })

            if (res.ok) {
                router.push('/admin')
                router.refresh()
            } else {
                const data = await res.json()
                setError(data.error || 'Silinemedi')
            }
        } catch (err) {
            setError('Silinirken bir hata oluştu')
            console.error(err)
        } finally {
            setDeleting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}

            {/* Image Upload */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Eser Görseli</h2>

                <div
                    className={`${styles.dropzone} ${dragActive ? styles.dropzoneActive : ''} ${imageUrl ? styles.dropzoneHasImage : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    {imageUrl ? (
                        <div className={styles.preview}>
                            <Image
                                src={imageUrl}
                                alt="Preview"
                                fill
                                className={styles.previewImage}
                            />
                            <div className={styles.previewOverlay}>
                                <span>Değiştirmek için tıklayın</span>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.dropzoneContent}>
                            {uploading ? (
                                <span>Yükleniyor...</span>
                            ) : (
                                <>
                                    <span className={styles.dropzoneIcon}>📷</span>
                                    <span className={styles.dropzoneText}>
                                        Resmi sürükleyip bırakın veya tıklayın
                                    </span>
                                    <span className={styles.dropzoneHint}>
                                        JPEG, PNG veya WebP (max 10MB)
                                    </span>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileSelect}
                    className={styles.fileInput}
                />
            </div>

            {/* Basic Info */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Temel Bilgiler</h2>

                <div className={styles.field}>
                    <label htmlFor="title" className={styles.label}>Başlık *</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="Örn: Fatiha Suresi"
                        required
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="artist" className={styles.label}>Hattat *</label>
                    <input
                        type="text"
                        id="artist"
                        name="artist"
                        value={formData.artist}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="classGrade" className={styles.label}>Sınıf / Branş</label>
                    <input
                        type="text"
                        id="classGrade"
                        name="classGrade"
                        value={formData.classGrade}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="Örn: 7. Sınıf veya Görsel Sanatlar Öğretmeni"
                    />
                </div>

                <div className={styles.row}>
                    <div className={styles.field}>
                        <label htmlFor="order" className={styles.label}>Sıra</label>
                        <input
                            type="number"
                            id="order"
                            name="order"
                            value={formData.order}
                            onChange={handleChange}
                            className={styles.input}
                            min="0"
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Durum</label>
                        <label className={styles.checkbox}>
                            <input
                                type="checkbox"
                                name="isPublished"
                                checked={formData.isPublished}
                                onChange={handleChange}
                            />
                            <span>Yayında</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>İçerik</h2>

                <div className={styles.field}>
                    <label htmlFor="arabicText" className={styles.label}>Arapça Metin *</label>
                    <textarea
                        id="arabicText"
                        name="arabicText"
                        value={formData.arabicText}
                        onChange={handleChange}
                        className={`${styles.textarea} ${styles.arabicInput}`}
                        rows={3}
                        dir="rtl"
                        required
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="meaning" className={styles.label}>Türkçe Meali *</label>
                    <textarea
                        id="meaning"
                        name="meaning"
                        value={formData.meaning}
                        onChange={handleChange}
                        className={styles.textarea}
                        rows={4}
                        required
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="description" className={styles.label}>Açıklama / Tefsir</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className={styles.textarea}
                        rows={4}
                    />
                </div>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
                <Link href="/admin" className={styles.cancelBtn}>
                    İptal
                </Link>

                <div className={styles.actionRight}>
                    {artwork && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className={styles.deleteBtn}
                            disabled={deleting}
                        >
                            {deleting ? 'Siliniyor...' : 'Sil'}
                        </button>
                    )}

                    <button
                        type="submit"
                        className={styles.saveBtn}
                        disabled={saving || uploading}
                    >
                        {saving ? 'Kaydediliyor...' : (artwork ? 'Güncelle' : 'Kaydet')}
                    </button>
                </div>
            </div>
        </form>
    )
}
