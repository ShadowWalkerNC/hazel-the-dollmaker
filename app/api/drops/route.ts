import { NextResponse } from 'next/server';
import { getDb } from '../../../db';
import { drops } from '../../../db/schema';
import { ACTIVE_DROP } from '../../../src/data/products';
import { isAuthorizedAdmin } from '../../admin-auth';
import type { Drop } from '../../../src/types';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const db = getDb();
    const rows = await db.select().from(drops);

    if (rows && rows.length > 0) {
      const active = rows.find((d) => d.status === 'open' || d.status === 'preview') || rows[0];
      const mapped: Drop = {
        id: active.id,
        wrestlerName: active.wrestlerName,
        title: active.title,
        tagline: active.tagline,
        description: active.description,
        heroImageUrl: active.heroImageUrl,
        capacityLimit: active.capacityLimit,
        dollsClaimed: active.dollsClaimed,
        orderingWindowStart: active.orderingWindowStart,
        orderingWindowEnd: active.orderingWindowEnd,
        estimatedShipByDate: active.estimatedShipByDate,
        status: active.status as any,
      };
      return NextResponse.json({ drop: mapped, allDrops: rows, source: 'database' });
    }
  } catch (err) {
    console.warn('Using seeded active drop fallback:', err);
  }

  return NextResponse.json({ drop: ACTIVE_DROP, allDrops: [ACTIVE_DROP], source: 'fallback' });
}

// Protected admin update drop
export async function POST(request: Request) {
  const authorized = await isAuthorizedAdmin(request);
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized admin access.' }, { status: 401 });
  }

  try {
    const body = await request.json() as Partial<Drop>;
    if (!body.id || !body.title) {
      return NextResponse.json({ error: 'Missing required drop fields.' }, { status: 400 });
    }

    const db = getDb();
    await db
      .insert(drops)
      .values({
        id: body.id,
        wrestlerName: body.wrestlerName || 'Featured Wrestler',
        title: body.title,
        tagline: body.tagline || '',
        description: body.description || '',
        heroImageUrl: body.heroImageUrl || '/hazel-logo.jpg',
        capacityLimit: body.capacityLimit ?? 15,
        dollsClaimed: body.dollsClaimed ?? 0,
        orderingWindowStart: body.orderingWindowStart || '2026-11-01',
        orderingWindowEnd: body.orderingWindowEnd || '2026-11-15',
        estimatedShipByDate: body.estimatedShipByDate || '2026-12-05',
        status: body.status || 'preview',
      })
      .onConflictDoUpdate({
        target: drops.id,
        set: {
          wrestlerName: body.wrestlerName || 'Featured Wrestler',
          title: body.title,
          tagline: body.tagline || '',
          description: body.description || '',
          heroImageUrl: body.heroImageUrl || '/hazel-logo.jpg',
          capacityLimit: body.capacityLimit ?? 15,
          dollsClaimed: body.dollsClaimed ?? 0,
          orderingWindowStart: body.orderingWindowStart || '2026-11-01',
          orderingWindowEnd: body.orderingWindowEnd || '2026-11-15',
          estimatedShipByDate: body.estimatedShipByDate || '2026-12-05',
          status: body.status || 'preview',
        },
      });

    return NextResponse.json({ ok: true, message: 'Drop schedule and capacity updated.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update drop.' }, { status: 500 });
  }
}
