import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT 
        Brand,
        COUNT(*) AS SKUCount,
        SUM(StockValue) AS TotalValue,
        SUM(Stock) AS TotalUnits
      FROM dbo.vw_DeadStock
      GROUP BY Brand
      ORDER BY SUM(StockValue) DESC
    `);
    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  }
}
