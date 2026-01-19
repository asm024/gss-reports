import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT 
        p.SKU,
        p.Title,
        b.Brand AS BrandName,
        c.CategoryName
      FROM dbo.vw_ProductsNoFitRef p
      LEFT JOIN dbo.tblBrands b ON b.Brand_ID = p.Brand
      LEFT JOIN dbo.tblCategories c ON c.Category_ID = p.Category
      ORDER BY p.SKU
    `);
    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  }
}