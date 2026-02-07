import './admin.css'

export const metadata = {
    title: 'Admin Panel | Hat Sanatı Sergisi',
}

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="admin-layout">
            {children}
        </div>
    )
}
