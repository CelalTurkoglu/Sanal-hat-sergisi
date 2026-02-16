'use client'

import Image from 'next/image'
import styles from './ArtworkSlider.module.css'

interface SliderArtwork {
    id: string
    thumbnail: string | null
    imageUrl: string
}

interface ArtworkSliderProps {
    artworks: SliderArtwork[]
}

export default function ArtworkSlider({ artworks }: ArtworkSliderProps) {
    if (artworks.length === 0) return null

    // Duplicate artworks to create seamless infinite scroll effect
    const duplicated = [...artworks, ...artworks]

    return (
        <div className={styles.sliderWrapper}>
            <div className={styles.sliderTrack}>
                {duplicated.map((artwork, index) => (
                    <div key={`${artwork.id}-${index}`} className={styles.sliderItem}>
                        <Image
                            src={artwork.thumbnail || artwork.imageUrl}
                            alt=""
                            width={320}
                            height={427}
                            className={styles.sliderImage}
                            sizes="160px"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
