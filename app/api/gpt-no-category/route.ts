import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT
        c.SKU,
        p.Title AS Description
      FROM tblChecklist c
      INNER JOIN tblProductsMaster p ON c.SKU = p.SKU
      WHERE c.GPT_Done = 1 AND p.Category = 1006
      ORDER BY c.SKU
    `);
    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  }
}
