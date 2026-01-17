import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT 
        COUNT(*) AS TotalSKUs,
        SUM(StockValue) AS TotalValue,
        SUM(CurrentStock) AS TotalUnits,
        SUM(OverstockedBy) AS TotalOverstock
      FROM dbo.vw_OverstockedItems
    `);
    return NextResponse.json(result.recordset[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  }
}
