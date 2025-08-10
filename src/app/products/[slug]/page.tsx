import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import AddToCart from './parts/AddToCart'

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug }, include: { images: true, category: true } })
  if (!product) return notFound()

  return (
    <section className="grid md:grid-cols-2 gap-8">
      <div>
        <img src={product.images[0]?.url || '/placeholder.png'} alt={product.images[0]?.alt || product.name} className="w-full h-auto rounded-xl" />
      </div>
      <div>
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-gray-600 mt-2">{product.description}</p>
        <ul className="text-sm text-gray-500 mt-4 space-y-1">
          {product.material && <li><b>Material:</b> {product.material}</li>}
          {product.color && <li><b>Color:</b> {product.color}</li>}
          {product.scale && <li><b>Scale:</b> {product.scale}</li>}
          <li><b>Category:</b> {product.category.name}</li>
        </ul>
        <div className="mt-6">
          <AddToCart productId={product.id} price={product.price} />
        </div>
      </div>
    </section>
  )
}
