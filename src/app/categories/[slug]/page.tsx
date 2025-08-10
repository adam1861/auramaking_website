import { prisma } from '@/lib/db'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { formatMoney } from '@/lib/pricing'

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await prisma.category.findUnique({ where: { slug: params.slug } })
  if (!category) return notFound()
  const products = await prisma.product.findMany({ where: { categoryId: category.id, isActive: true }, include: { images: true } })

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">{category.name}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map(p => (
          <Link key={p.id} href={`/products/${p.slug}`} className="border rounded-xl p-4 hover:shadow">
            <img src={p.images[0]?.url || '/placeholder.png'} alt={p.images[0]?.alt || p.name} className="w-full h-48 object-cover rounded-lg mb-3" />
            <div className="font-medium">{p.name}</div>
            <div className="text-sm text-gray-500">{formatMoney(p.price)}</div>
          </Link>
        ))}
      </div>
    </section>
  )
}
