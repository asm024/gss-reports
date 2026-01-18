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
        Stock,
        StockValue,
        LastSaleDate,
        DaysSinceSale,
        AgeBracket
      FROM dbo.vw_DeadStock
      ORDER BY StockValue DESC
    `);
    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  }
}
