'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddToCart({ productId, price }: { productId: string, price: number }) {
  const [qty, setQty] = useState(1)
  const router = useRouter()
  return (
    <div className="flex items-center gap-3">
      <input type="number" min={1} value={qty} onChange={e => setQty(parseInt(e.target.value || '1'))} className="border rounded px-2 py-1 w-20" />
      <button
        onClick={async () => {
          await fetch('/api/cart/add', { method: 'POST', body: JSON.stringify({ productId, quantity: qty }) })
          router.push('/cart')
        }}
        className="bg-brand text-white px-4 py-2 rounded-lg"
      >Add to Cart</button>
    </div>
  )
}
