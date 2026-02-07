'use client'

import { useRouter } from 'next/navigation'

export default function LogoutButton() {
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await fetch('/api/auth', { method: 'DELETE' })
            router.push('/admin/login')
            router.refresh()
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    return (
        <button onClick={handleLogout} className="admin-logout-btn">
            Çıkış Yap
        </button>
    )
}
