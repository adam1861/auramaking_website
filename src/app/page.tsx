import Link from 'next/link'
import { prisma } from '@/lib/db'
import { unstable_noStore as noStore } from 'next/cache'

export default async function HomePage() {
  noStore()
  const categories = await prisma.category.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } })
  return (
    <section className="space-y-8">
      <div className="bg-gray-100 rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-3">3D Printing by Auramaking</h1>
        <p className="text-gray-600">High-quality prints across Anime Figures, Decorations, and Board Games — shipped from Morocco.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {categories.map((c, idx) => (
            <Link
              key={c.id}
              className={`${idx % 2 === 0 ? 'bg-brand text-white' : 'bg-gray-900 text-white'} px-4 py-2 rounded-lg`}
              href={`/categories/${c.slug}`}
            >
              Shop {c.name}
            </Link>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map(c => (
            <CategoryCard key={c.id} name={c.name} slug={c.slug} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CategoryCard({ name, slug }: { name: string, slug: string }) {
  return (
    <Link href={`/categories/${slug}`} className="rounded-xl border p-6 hover:shadow">
      <div className="text-lg font-semibold">{name}</div>
      <div className="text-gray-500">Explore {name}</div>
    </Link>
  )
}
