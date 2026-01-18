import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT 
        AgeBracket,
        COUNT(*) AS SKUCount,
        SUM(StockValue) AS TotalValue,
        SUM(Stock) AS TotalUnits
<<<<<<< HEAD
      FROM dbo.vw_DeadStockUnlisted
=======
      FROM dbo.vw_DeadStockUnlisted
>>>>>>> 2a91509 (Add Dead Stock Unlisted report)
      GROUP BY AgeBracket
      ORDER BY 
        CASE AgeBracket
          WHEN '3-5 Years' THEN 1
          WHEN '5-7 Years' THEN 2
          WHEN '7-10 Years' THEN 3
          WHEN '10+ Years' THEN 4
          WHEN 'Never Sold' THEN 5
          ELSE 6
        END
    `);
    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  }
}
