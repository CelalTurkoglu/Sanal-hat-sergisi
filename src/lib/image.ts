import sharp from 'sharp'
import path from 'path'
import fs from 'fs/promises'
import { uploadToR2, deleteFromR2, isR2Configured } from './r2'

const UPLOAD_DIR = process.env.UPLOAD_DIR || './public/uploads'
const MAX_WIDTH = 1920
const THUMBNAIL_WIDTH = 400
const THUMBNAIL_HEIGHT = 500
const QUALITY = 85

export async function ensureUploadDir() {
    try {
        await fs.access(UPLOAD_DIR)
    } catch {
        await fs.mkdir(UPLOAD_DIR, { recursive: true })
    }
}

export async function processImage(
    buffer: Buffer,
    filename: string
): Promise<{ imageUrl: string; thumbnail: string }> {
    const timestamp = Date.now()
    const baseName = path.parse(filename).name.replace(/[^a-zA-Z0-9]/g, '_')

    // Process full size image
    const fullImageBuffer = await sharp(buffer)
        .resize(MAX_WIDTH, null, {
            withoutEnlargement: true,
            fit: 'inside'
        })
        .webp({ quality: QUALITY })
        .toBuffer()

    // Process thumbnail
    const thumbnailBuffer = await sharp(buffer)
        .resize(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, {
            fit: 'cover',
            position: 'center'
        })
        .webp({ quality: QUALITY })
        .toBuffer()

    // Use R2 if configured, otherwise use local storage
    if (isR2Configured()) {
        const fullName = `${timestamp}-${baseName}.webp`
        const thumbName = `${timestamp}-${baseName}-thumb.webp`

        const [imageUrl, thumbnail] = await Promise.all([
            uploadToR2(fullImageBuffer, fullName, 'image/webp'),
            uploadToR2(thumbnailBuffer, thumbName, 'image/webp'),
        ])

        return { imageUrl, thumbnail }
    } else {
        // Local storage fallback
        await ensureUploadDir()

        const fullName = `${timestamp}-${baseName}.webp`
        const thumbName = `${timestamp}-${baseName}-thumb.webp`
        const fullPath = path.join(UPLOAD_DIR, fullName)
        const thumbPath = path.join(UPLOAD_DIR, thumbName)

        await Promise.all([
            fs.writeFile(fullPath, fullImageBuffer),
            fs.writeFile(thumbPath, thumbnailBuffer),
        ])

        return {
            imageUrl: `/uploads/${fullName}`,
            thumbnail: `/uploads/${thumbName}`,
        }
    }
}

export async function deleteImage(imageUrl: string, thumbnailUrl?: string) {
    // Check if R2 URLs
    if (imageUrl.startsWith('http')) {
        await deleteFromR2(imageUrl)
        if (thumbnailUrl) {
            await deleteFromR2(thumbnailUrl)
        }
        return
    }

    // Local file deletion
    const fullPath = path.join('./public', imageUrl)
    try {
        await fs.unlink(fullPath)
    } catch (error) {
        console.error('Error deleting image:', error)
    }

    if (thumbnailUrl) {
        const thumbPath = path.join('./public', thumbnailUrl)
        try {
            await fs.unlink(thumbPath)
        } catch (error) {
            console.error('Error deleting thumbnail:', error)
        }
    }
}
