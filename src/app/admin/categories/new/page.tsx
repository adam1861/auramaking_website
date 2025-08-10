import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function createCategory(formData: FormData) {
  'use server'
  const name = (formData.get('name') || '').toString().trim()
  const slug = (formData.get('slug') || '').toString().trim()
  const description = (formData.get('description') || '').toString().trim() || null
  const imageUrl = (formData.get('imageUrl') || '').toString().trim() || null
  const isActive = formData.get('isActive') === 'on'

  if (!name || !slug) {
    throw new Error('Name and slug are required')
  }

  await prisma.category.create({
    data: { name, slug, description: description || undefined, imageUrl: imageUrl || undefined, isActive }
  })
  revalidatePath('/admin/categories')
  redirect('/admin/categories')
}

export default function NewCategoryPage() {
  return (
    <section className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">New Category</h1>
      </div>
      <form action={createCategory} className="space-y-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="name">Name</label>
          <input id="name" name="name" className="border rounded-lg px-3 py-2" required />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="slug">Slug</label>
          <input id="slug" name="slug" className="border rounded-lg px-3 py-2" placeholder="my-category" required />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="description">Description</label>
          <textarea id="description" name="description" className="border rounded-lg px-3 py-2" rows={3} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="imageUrl">Image URL</label>
          <input id="imageUrl" name="imageUrl" className="border rounded-lg px-3 py-2" placeholder="https://..." />
        </div>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="isActive" defaultChecked />
          <span className="text-sm">Active</span>
        </label>
        <div className="flex gap-2">
          <button type="submit" className="bg-brand text-white px-4 py-2 rounded-lg">Create</button>
          <a href="/admin/categories" className="px-4 py-2 border rounded-lg">Cancel</a>
        </div>
      </form>
    </section>
  )
}


