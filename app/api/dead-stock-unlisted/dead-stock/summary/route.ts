import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT 
        COUNT(*) AS TotalSKUs,
        SUM(StockValue) AS TotalValue,
        SUM(Stock) AS TotalUnits,
        SUM(CASE WHEN LastSaleDate IS NULL THEN 1 ELSE 0 END) AS NeverSold
      FROM dbo.vw_DeadStock
    `);
    return NextResponse.json(result.recordset[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  }
}
