import Link from 'next/link'

export default function HomePage() {
  return (
    <section className="space-y-8">
      <div className="bg-gray-100 rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-3">3D Printing by Auramaking</h1>
        <p className="text-gray-600">High-quality prints across Anime Figures, Decorations, and Board Games — shipped from Morocco.</p>
        <div className="mt-6 flex gap-3">
          <Link className="bg-brand text-white px-4 py-2 rounded-lg" href="/categories/anime-figures">Shop Anime</Link>
          <Link className="bg-gray-900 text-white px-4 py-2 rounded-lg" href="/categories/board-games">Shop Board Games</Link>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CategoryCard name="Anime Figures" slug="anime-figures" />
          <CategoryCard name="Decorations" slug="decorations" />
          <CategoryCard name="Board Games" slug="board-games" />
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
