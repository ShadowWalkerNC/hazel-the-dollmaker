import { NextResponse } from 'next/server';
import { getDb } from '../../../db';
import { orders, drops } from '../../../db/schema';
import { isAuthorizedAdmin } from '../../admin-auth';
import type { OrderInfo, CartItem } from '../../../src/types';
import { eq, sql } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.json() as Partial<OrderInfo> & { items: CartItem[] };

    if (!body.customerName || !body.customerEmail || !body.shippingAddress || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Please provide your name, valid email, shipping address, and at least one item.' },
        { status: 400 }
      );
    }

    // Verify email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.customerEmail)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    // Calculate total doll capacity slots required
    const dollSlots = body.items.reduce((acc, it) => {
      const usage = it.product?.dollCapacityUsage ?? 0;
      return acc + usage * (it.quantity || 1);
    }, 0);

    const orderId = `HDM-${Math.floor(100000 + Math.random() * 900000)}`;
    const subtotal = Number(body.subtotal || 0);
    const discount = Number(body.discount || 0);
    const shipping = Number(body.shipping || 0);
    const total = Number(body.total || subtotal - discount + shipping);

    const newOrder: OrderInfo = {
      orderId,
      customerName: body.customerName.trim(),
      customerEmail: body.customerEmail.trim().toLowerCase(),
      customerInstagram: body.customerInstagram?.trim() || undefined,
      customerPhone: body.customerPhone?.trim() || undefined,
      preferredContact: body.preferredContact || 'instagram',
      shippingAddress: body.shippingAddress.trim(),
      items: body.items,
      dollSlotsReserved: dollSlots,
      subtotal,
      discount,
      shipping,
      total,
      promoCode: body.promoCode?.trim() || undefined,
      status: 'pending_review',
      notesToHazel: body.notesToHazel?.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    try {
      const db = getDb();
      // Insert order into D1
      await db.insert(orders).values({
        id: orderId,
        customerName: newOrder.customerName,
        customerEmail: newOrder.customerEmail,
        customerInstagram: newOrder.customerInstagram ?? null,
        customerPhone: newOrder.customerPhone ?? null,
        preferredContact: newOrder.preferredContact,
        shippingAddress: newOrder.shippingAddress,
        itemsJson: JSON.stringify(newOrder.items),
        dollSlotsReserved: dollSlots,
        subtotal,
        discount,
        shipping,
        total,
        promoCode: newOrder.promoCode ?? null,
        status: 'pending_review',
        notesToHazel: newOrder.notesToHazel ?? null,
      });

      // If doll slots were reserved, update claimed count in active drop
      if (dollSlots > 0) {
        try {
          const activeDrops = await db.select().from(drops);
          if (activeDrops && activeDrops.length > 0) {
            const active = activeDrops[0];
            await db
              .update(drops)
              .set({
                dollsClaimed: sql`${drops.dollsClaimed} + ${dollSlots}`,
                updatedAt: sql`CURRENT_TIMESTAMP`,
              })
              .where(eq(drops.id, active.id));
          }
        } catch (dropErr) {
          console.warn('Could not increment drop claimed slots:', dropErr);
        }
      }
    } catch (dbErr) {
      console.warn('Could not persist to database, returning local order:', dbErr);
    }

    return NextResponse.json({ ok: true, order: newOrder });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to submit order for review.' }, { status: 500 });
  }
}

// Protected admin: List all orders
export async function GET(request: Request) {
  const authorized = await isAuthorizedAdmin(request);
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized admin access.' }, { status: 401 });
  }

  try {
    const db = getDb();
    const rows = await db.select().from(orders);

    const mapped: OrderInfo[] = rows.map((r) => ({
      orderId: r.id,
      customerName: r.customerName,
      customerEmail: r.customerEmail,
      customerInstagram: r.customerInstagram ?? undefined,
      customerPhone: r.customerPhone ?? undefined,
      preferredContact: r.preferredContact as any,
      shippingAddress: r.shippingAddress,
      items: JSON.parse(r.itemsJson),
      dollSlotsReserved: r.dollSlotsReserved,
      subtotal: r.subtotal,
      discount: r.discount,
      shipping: r.shipping,
      total: r.total,
      promoCode: r.promoCode ?? undefined,
      status: r.status as any,
      notesToHazel: r.notesToHazel ?? undefined,
      createdAt: r.createdAt,
    }));

    return NextResponse.json({ orders: mapped });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch orders.' }, { status: 500 });
  }
}

// Protected admin: Update order status
export async function PATCH(request: Request) {
  const authorized = await isAuthorizedAdmin(request);
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized admin access.' }, { status: 401 });
  }

  try {
    const body = await request.json() as { orderId: string; status: OrderInfo['status'] };
    if (!body.orderId || !body.status) {
      return NextResponse.json({ error: 'orderId and status required' }, { status: 400 });
    }

    const db = getDb();
    await db
      .update(orders)
      .set({
        status: body.status,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      })
      .where(eq(orders.id, body.orderId));

    return NextResponse.json({ ok: true, message: `Order ${body.orderId} updated to ${body.status}` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update order.' }, { status: 500 });
  }
}
