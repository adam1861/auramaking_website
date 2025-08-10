import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { redirect, notFound } from 'next/navigation'

async function updateProduct(id: string, formData: FormData) {
  'use server'
  const name = (formData.get('name') || '').toString().trim()
  const slug = (formData.get('slug') || '').toString().trim()
  const price = Number(formData.get('price') || 0)
  const description = (formData.get('description') || '').toString().trim() || null
  const material = (formData.get('material') || '').toString().trim() || null
  const color = (formData.get('color') || '').toString().trim() || null
  const scale = (formData.get('scale') || '').toString().trim() || null
  const categoryId = (formData.get('categoryId') || '').toString().trim()
  const imageUrl = (formData.get('imageUrl') || '').toString().trim()
  const isActive = formData.get('isActive') === 'on'
  const isFeatured = formData.get('isFeatured') === 'on'

  if (!name || !slug || !price || !categoryId) {
    throw new Error('Name, slug, price and category are required')
  }

  await prisma.product.update({
    where: { id },
    data: {
      name,
      slug,
      price: Math.round(price),
      description: description || undefined,
      material: material || undefined,
      color: color || undefined,
      scale: scale || undefined,
      categoryId,
      isActive,
      isFeatured,
      // Keep it simple: if imageUrl provided, replace first image by deleting all and creating one
      images: imageUrl
        ? {
            deleteMany: {},
            create: [{ url: imageUrl, alt: name }],
          }
        : undefined,
    }
  })

  revalidatePath('/admin/products')
  redirect('/admin/products')
}

async function deleteProduct(id: string) {
  'use server'
  await prisma.product.delete({ where: { id } })
  revalidatePath('/admin/products')
  redirect('/admin/products')
}

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({ where: { id: params.id }, include: { images: true } })
  if (!product) return notFound()
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
  const primaryImage = product.images[0]?.url || ''
  return (
    <section className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <form action={deleteProduct.bind(null, product.id)}>
          <button type="submit" className="px-3 py-2 border rounded-lg text-red-600 border-red-300">Delete</button>
        </form>
      </div>
      <form action={updateProduct.bind(null, product.id)} className="space-y-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="name">Name</label>
          <input id="name" name="name" defaultValue={product.name} className="border rounded-lg px-3 py-2" required />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="slug">Slug</label>
          <input id="slug" name="slug" defaultValue={product.slug} className="border rounded-lg px-3 py-2" required />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="price">Price (cents)</label>
          <input id="price" name="price" type="number" min="0" step="1" defaultValue={product.price} className="border rounded-lg px-3 py-2" required />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="categoryId">Category</label>
          <select id="categoryId" name="categoryId" defaultValue={product.categoryId} className="border rounded-lg px-3 py-2" required>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="imageUrl">Image URL</label>
          <input id="imageUrl" name="imageUrl" defaultValue={primaryImage} className="border rounded-lg px-3 py-2" placeholder="https://..." />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="description">Description</label>
          <textarea id="description" name="description" defaultValue={product.description || ''} className="border rounded-lg px-3 py-2" rows={3} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="material">Material</label>
            <input id="material" name="material" defaultValue={product.material || ''} className="border rounded-lg px-3 py-2" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="color">Color</label>
            <input id="color" name="color" defaultValue={product.color || ''} className="border rounded-lg px-3 py-2" />
          </div>
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="scale">Scale</label>
          <input id="scale" name="scale" defaultValue={product.scale || ''} className="border rounded-lg px-3 py-2" />
        </div>
        <div className="flex gap-6">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" name="isActive" defaultChecked={product.isActive} />
            <span className="text-sm">Active</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" name="isFeatured" defaultChecked={product.isFeatured} />
            <span className="text-sm">Featured</span>
          </label>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="bg-brand text-white px-4 py-2 rounded-lg">Save</button>
          <a href="/admin/products" className="px-4 py-2 border rounded-lg">Cancel</a>
        </div>
      </form>
    </section>
  )
}


