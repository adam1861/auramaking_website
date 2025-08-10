import Link from 'next/link'
export default function AdminHome() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <AdminCard title="Categories" href="/admin/categories" />
        <AdminCard title="Products" href="/admin/products" />
        <AdminCard title="Orders" href="/admin/orders" />
      </div>
      <p className="text-sm text-gray-500">Auth to be wired (NextAuth) — current pages are visible in dev only.</p>
    </section>
  )
}
function AdminCard({ title, href }: { title: string, href: string }) {
  return (
    <Link href={href} className="border rounded-xl p-6 hover:shadow block">
      <div className="font-semibold">{title}</div>
      <div className="text-gray-500 text-sm mt-1">Manage {title.toLowerCase()}.</div>
    </Link>
  )
}
