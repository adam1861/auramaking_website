import { NextRequest, NextResponse } from 'next/server'
import { paypalCapture } from '@/lib/payments/paypal'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  const { providerOrderId, orderId } = await req.json()
  if (!providerOrderId || !orderId) return NextResponse.json({ ok: false }, { status: 400 })
  const capture = await paypalCapture(providerOrderId)
  const order = await prisma.order.update({ where: { id: orderId }, data: { status: 'PAID', providerCaptureId: capture?.purchase_units?.[0]?.payments?.captures?.[0]?.id || null } })
  return NextResponse.json({ ok: true, captureId: order.providerCaptureId })
}
