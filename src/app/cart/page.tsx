import { prisma } from '@/lib/db'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { formatMoney } from '@/lib/pricing'

export default async function CartPage() {
  const cookieStore = await cookies()
  const cartId = cookieStore.get('cart_id')?.value
  let items: any[] = []
  if (cartId) {
    const cart = await prisma.cart.findUnique({ where: { id: cartId }, include: { items: { include: { product: true } } } })
    items = cart?.items ?? []
  }
  const subtotal = items.reduce((s, i) => s + i.priceAtAdd * i.quantity, 0)

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Your Cart</h1>
      {items.length === 0 ? (
        <p>Your cart is empty. <Link href="/">Go shopping</Link></p>
      ) : (
        <div className="space-y-3">
          {items.map(i => (
            <div key={i.id} className="flex justify-between border rounded-lg p-3">
              <div>{i.product.name} × {i.quantity}</div>
              <div>{formatMoney(i.priceAtAdd * i.quantity)}</div>
            </div>
          ))}
          <div className="text-right font-semibold">Subtotal: {formatMoney(subtotal)}</div>
          <div className="text-right">
            <Link href="/checkout" className="bg-brand text-white px-4 py-2 rounded-lg inline-block">Checkout</Link>
          </div>
        </div>
      )}
    </section>
  )
}
