'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

export default function LoginPage() {
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            })

            const data = await res.json()

            if (res.ok) {
                router.push('/admin')
                router.refresh()
            } else {
                setError(data.error || 'Giriş başarısız')
            }
        } catch (err) {
            setError('Bir hata oluştu. Lütfen tekrar deneyin.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.card}>
                    {/* Logo/Title */}
                    <div className={styles.header}>
                        <h1 className={styles.title}>Admin Paneli</h1>
                        <p className={styles.subtitle}>Hat Sanatı Sergisi</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className={styles.form}>
                        {error && (
                            <div className={styles.error}>
                                {error}
                            </div>
                        )}

                        <div className={styles.field}>
                            <label htmlFor="username" className={styles.label}>
                                Kullanıcı Adı
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={styles.input}
                                required
                                autoComplete="username"
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="password" className={styles.label}>
                                Şifre
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.input}
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        <button
                            type="submit"
                            className={styles.button}
                            disabled={loading}
                        >
                            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    )
}
