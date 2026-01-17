import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT 
        SKU,
        Title,
        Brand,
        Category,
        Location,
        CurrentStock,
        MaxLevel,
        OverstockedBy,
        StockValue
      FROM dbo.vw_OverstockedItems
      ORDER BY OverstockedBy DESC
    `);
    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  }
}
