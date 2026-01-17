import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT
        pm.SKU,
        pm.Title,
        pb.Neto_Name AS Brand,
        ps.SuppCode AS Supplier,
        qoh.TotalStock AS Stock
      FROM tblProductsMaster pm
      INNER JOIN tblProductSupplier ps ON ps.ID = pm.PrefSupp
      INNER JOIN tblProductBrand pb ON pb.ID = pm.Brand
      INNER JOIN dbo.vw_ProductStock qoh ON qoh.SKU = pm.SKU
      WHERE pm.Category = 1006 AND qoh.TotalStock >= 1
      ORDER BY qoh.TotalStock DESC
    `);
    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  }
}
