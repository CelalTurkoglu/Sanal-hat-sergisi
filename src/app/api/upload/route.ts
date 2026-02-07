import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { processImage } from '@/lib/image'

export async function POST(request: NextRequest) {
    try {
        const authenticated = await isAuthenticated()
        if (!authenticated) {
            return NextResponse.json(
                { error: 'Yetkisiz erişim' },
                { status: 401 }
            )
        }

        const formData = await request.formData()
        const file = formData.get('file') as File | null

        if (!file) {
            return NextResponse.json(
                { error: 'Dosya bulunamadı' },
                { status: 400 }
            )
        }

        // Check file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Sadece JPEG, PNG ve WebP dosyaları yüklenebilir' },
                { status: 400 }
            )
        }

        // Check file size (10MB max)
        const maxSize = parseInt(process.env.MAX_FILE_SIZE || '10485760')
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'Dosya boyutu çok büyük (max 10MB)' },
                { status: 400 }
            )
        }

        // Convert to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Process image (convert to WebP, create thumbnail)
        const { imageUrl, thumbnail } = await processImage(buffer, file.name)

        return NextResponse.json({ imageUrl, thumbnail })
    } catch (error) {
        console.error('Error uploading image:', error)
        return NextResponse.json(
            { error: 'Resim yüklenirken bir hata oluştu' },
            { status: 500 }
        )
    }
}
