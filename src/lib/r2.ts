import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

// Cloudflare R2 is S3-compatible
const R2 = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
})

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'calligraphy-assets'
const PUBLIC_URL = process.env.R2_PUBLIC_URL || ''

export async function uploadToR2(
    buffer: Buffer,
    fileName: string,
    contentType: string
): Promise<string> {
    const key = `artworks/${Date.now()}-${fileName}`

    await R2.send(
        new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: contentType,
        })
    )

    // Return public URL
    return `${PUBLIC_URL}/${key}`
}

export async function deleteFromR2(url: string): Promise<void> {
    if (!url.startsWith(PUBLIC_URL)) return

    const key = url.replace(`${PUBLIC_URL}/`, '')

    try {
        await R2.send(
            new DeleteObjectCommand({
                Bucket: BUCKET_NAME,
                Key: key,
            })
        )
    } catch (error) {
        console.error('Error deleting from R2:', error)
    }
}

export function isR2Configured(): boolean {
    return !!(
        process.env.R2_ENDPOINT &&
        process.env.R2_ACCESS_KEY_ID &&
        process.env.R2_SECRET_ACCESS_KEY &&
        process.env.R2_BUCKET_NAME
    )
}
