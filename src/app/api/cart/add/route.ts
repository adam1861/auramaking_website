import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body?.productId || !body?.quantity) return NextResponse.json({ ok: false }, { status: 400 })

  const product = await prisma.product.findUnique({ where: { id: body.productId } })
  if (!product) return NextResponse.json({ ok: false, error: 'Product not found' }, { status: 404 })

  const cookieStore = await cookies()
  let cartId = cookieStore.get('cart_id')?.value
  if (!cartId) {
    const cart = await prisma.cart.create({ data: {} })
    cartId = cart.id
    cookieStore.set('cart_id', cartId, { path: '/', httpOnly: false })
  }

  await prisma.cartItem.create({
    data: {
      cartId,
      productId: product.id,
      quantity: Number(body.quantity) || 1,
      priceAtAdd: product.price
    }
  })

  return NextResponse.json({ ok: true })
}
