import { NextResponse } from 'next/server';
import { getDb } from '../../../db';
import { products } from '../../../db/schema';
import { INITIAL_PRODUCTS } from '../../../src/data/products';
import { isAuthorizedAdmin } from '../../admin-auth';
import type { Product } from '../../../src/types';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const db = getDb();
    const rows = await db.select().from(products);
    
    if (rows && rows.length > 0) {
      const mapped: Product[] = rows.map((r) => ({
        id: r.id,
        name: r.name,
        tagline: r.tagline,
        description: r.description,
        price: r.price,
        originalPrice: r.originalPrice ?? undefined,
        category: r.category as any,
        state: r.state as any,
        badge: r.badge ?? undefined,
        mockupType: (r.mockupType as any) ?? undefined,
        imageUrl: r.imageUrl,
        dropId: r.dropId ?? undefined,
        dollCapacityUsage: r.dollCapacityUsage,
        productionHours: r.productionHours,
        hasSizes: r.hasSizes,
        sizes: r.sizesJson ? JSON.parse(r.sizesJson) : undefined,
        requiresCustomNotes: r.requiresCustomNotes,
        customNotesPlaceholder: r.customNotesPlaceholder ?? undefined,
        sortOrder: r.sortOrder,
      }));
      return NextResponse.json({ products: mapped, source: 'database' });
    }
  } catch (err) {
    // If table not seeded or D1 temporarily unavailable, return default seed products
    console.warn('Using seeded initial products fallback:', err);
  }

  return NextResponse.json({ products: INITIAL_PRODUCTS, source: 'fallback' });
}

// Protected admin update/create product
export async function POST(request: Request) {
  const authorized = await isAuthorizedAdmin(request);
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized admin access.' }, { status: 401 });
  }

  try {
    const body = await request.json() as Partial<Product>;
    if (!body.id || !body.name || typeof body.price !== 'number') {
      return NextResponse.json({ error: 'Missing required product fields.' }, { status: 400 });
    }

    const db = getDb();
    await db
      .insert(products)
      .values({
        id: body.id,
        name: body.name,
        tagline: body.tagline || '',
        description: body.description || '',
        price: body.price,
        originalPrice: body.originalPrice ?? null,
        category: body.category || 'custom-doll',
        state: body.state || 'available',
        badge: body.badge ?? null,
        mockupType: body.mockupType ?? null,
        imageUrl: body.imageUrl || '/hazel-logo.jpg',
        dropId: body.dropId ?? null,
        dollCapacityUsage: body.dollCapacityUsage ?? 0,
        productionHours: body.productionHours ?? 0,
        hasSizes: Boolean(body.hasSizes),
        sizesJson: JSON.stringify(body.sizes || []),
        requiresCustomNotes: Boolean(body.requiresCustomNotes),
        customNotesPlaceholder: body.customNotesPlaceholder ?? null,
        sortOrder: body.sortOrder ?? 0,
      })
      .onConflictDoUpdate({
        target: products.id,
        set: {
          name: body.name,
          tagline: body.tagline || '',
          description: body.description || '',
          price: body.price,
          originalPrice: body.originalPrice ?? null,
          category: body.category || 'custom-doll',
          state: body.state || 'available',
          badge: body.badge ?? null,
          mockupType: body.mockupType ?? null,
          imageUrl: body.imageUrl || '/hazel-logo.jpg',
          dropId: body.dropId ?? null,
          dollCapacityUsage: body.dollCapacityUsage ?? 0,
          productionHours: body.productionHours ?? 0,
          hasSizes: Boolean(body.hasSizes),
          sizesJson: JSON.stringify(body.sizes || []),
          requiresCustomNotes: Boolean(body.requiresCustomNotes),
          customNotesPlaceholder: body.customNotesPlaceholder ?? null,
          sortOrder: body.sortOrder ?? 0,
        },
      });

    return NextResponse.json({ ok: true, message: 'Product saved successfully.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save product.' }, { status: 500 });
  }
}
