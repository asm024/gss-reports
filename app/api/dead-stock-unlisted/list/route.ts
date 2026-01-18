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
<<<<<<< HEAD
      FROM dbo.vw_DeadStockUnlisted
=======
      FROM dbo.vw_DeadStockUnlisted
>>>>>>> 2a91509 (Add Dead Stock Unlisted report)
      ORDER BY StockValue DESC
    `);
    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  }
}
