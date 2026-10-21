import { NextResponse } from 'next/server';
import { getDb } from '../../../../db';
import { interests, orders, drops, products } from '../../../../db/schema';
import { isAuthorizedAdmin } from '../../../admin-auth';
import { INITIAL_PRODUCTS, ACTIVE_DROP } from '../../../../src/data/products';
import { desc } from 'drizzle-orm';

export async function GET(request: Request) {
  const authorized = await isAuthorizedAdmin(request);
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized admin access.' }, { status: 401 });
  }

  const url = new URL(request.url);
  const format = url.searchParams.get('format'); // 'json' or 'csv'
  const exportType = url.searchParams.get('type') || 'all'; // 'signups' | 'collabs' | 'nominations' | 'orders' | 'products'

  try {
    const db = getDb();

    // Fetch interests
    const interestRows = await db.select().from(interests).orderBy(desc(interests.createdAt)).catch(() => []);
    
    // Group interests
    const collectors = interestRows.filter((r: any) => r.kind === 'collector');
    const collabs = interestRows.filter((r: any) => r.kind === 'wrestler');
    const nominationsRaw = interestRows.filter((r: any) => r.kind === 'nomination');

    // Group fan nominations to see demand
    const nominationCounts: Record<string, { count: number; name: string; handles: string[]; reasons: string[]; lastNominated: string }> = {};
    for (const nom of nominationsRaw) {
      // Extract nominated wrestler name if in details or name
      const lines = nom.details.split('\n');
      const wrestlerLine = lines.find((l: string) => l.startsWith('Nominated Wrestler:'));
      const wrestlerTarget = wrestlerLine ? wrestlerLine.replace('Nominated Wrestler:', '').trim() : nom.name;
      const key = wrestlerTarget.toLowerCase();

      if (!nominationCounts[key]) {
        nominationCounts[key] = {
          count: 0,
          name: wrestlerTarget,
          handles: [],
          reasons: [],
          lastNominated: nom.createdAt,
        };
      }
      nominationCounts[key].count += 1;
      const handleLine = lines.find((l: string) => l.startsWith('Social Handle:'));
      if (handleLine) {
        const handle = handleLine.replace('Social Handle:', '').trim();
        if (handle && !nominationCounts[key].handles.includes(handle)) {
          nominationCounts[key].handles.push(handle);
        }
      }
      const reasonLine = lines.find((l: string) => l.startsWith('Reason / Match:'));
      if (reasonLine) {
        const reason = reasonLine.replace('Reason / Match:', '').trim();
        if (reason && !nominationCounts[key].reasons.includes(reason)) {
          nominationCounts[key].reasons.push(reason);
        }
      }
    }

    const groupedNominations = Object.values(nominationCounts).sort((a, b) => b.count - a.count);

    // Fetch orders
    const orderRows = await db.select().from(orders).orderBy(desc(orders.createdAt)).catch(() => []);

    // Fetch drops
    const dropRows = await db.select().from(drops).catch(() => []);
    const activeDrop = dropRows.length > 0 ? dropRows[0] : ACTIVE_DROP;

    // Fetch products
    const productRows = await db.select().from(products).catch(() => []);
    const currentProducts = productRows.length > 0 ? productRows : INITIAL_PRODUCTS;

    // CSV Export Handler
    if (format === 'csv') {
      let csvContent = '';
      let filename = 'hazel-export.csv';

      if (exportType === 'signups') {
        filename = 'hazel-collector-club.csv';
        csvContent = 'ID,Name,Email,Details,Date\n' +
          collectors.map((c: any) => `"${c.id}","${escapeCsv(c.name)}","${escapeCsv(c.email)}","${escapeCsv(c.details)}","${c.createdAt}"`).join('\n');
      } else if (exportType === 'collabs') {
        filename = 'hazel-wrestler-collaborations.csv';
        csvContent = 'ID,Contact Name,Email,Details,Date\n' +
          collabs.map((c: any) => `"${c.id}","${escapeCsv(c.name)}","${escapeCsv(c.email)}","${escapeCsv(c.details)}","${c.createdAt}"`).join('\n');
      } else if (exportType === 'nominations') {
        filename = 'hazel-wrestler-nominations.csv';
        csvContent = 'Wrestler,Votes,Handles,Reasons,LastNominated\n' +
          groupedNominations.map((g: any) => `"${escapeCsv(g.name)}",${g.count},"${escapeCsv(g.handles.join(', ')) }","${escapeCsv(g.reasons.join(' | ')) }","${g.lastNominated}"`).join('\n');
      } else if (exportType === 'orders') {
        filename = 'hazel-orders.csv';
        csvContent = 'OrderID,Customer,Email,ContactType,Phone,Instagram,DollSlots,Total,Status,Address,Date\n' +
          orderRows.map((o: any) => `"${o.id}","${escapeCsv(o.customerName)}","${escapeCsv(o.customerEmail)}","${o.preferredContact}","${escapeCsv(o.customerPhone || '')}","${escapeCsv(o.customerInstagram || '')}",${o.dollSlotsReserved},${o.total},"${o.status}","${escapeCsv(o.shippingAddress)}","${o.createdAt}"`).join('\n');
      }

      return new Response(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    }

    return NextResponse.json({
      collectors,
      collabs,
      groupedNominations,
      rawNominations: nominationsRaw,
      orders: orderRows,
      activeDrop,
      allDrops: dropRows,
      products: currentProducts,
      counts: {
        collectorsCount: collectors.length,
        collabsCount: collabs.length,
        nominationsCount: nominationsRaw.length,
        ordersCount: orderRows.length,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to aggregate admin data.' }, { status: 500 });
  }
}

function escapeCsv(str: string): string {
  if (!str) return '';
  return str.replace(/"/g, '""').replace(/\n/g, ' ');
}
