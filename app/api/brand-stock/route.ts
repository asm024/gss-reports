import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getConnection();
    
    const result = await pool.request().query(`
      SELECT
        MIN(sd.ID) AS ID,
        MIN(sd.Scraped_Supplier) AS Scraped_Supplier,
        sd.Scraped_Brand,
        COUNT(pm.SKU) AS SKU_Count,
        SUM(
          q.QOH_A1 + q.QOH_AAD + q.QOH_AAP + 
          q.QOH_APW + q.QOH_ACS_A + q.QOH_ACS_S + 
          q.QOH_DBA_SYD + q.QOH_KAILOS + q.QOH_GSS + 
          q.QOH_PAT_SYD + q.QOH_PAT_MEL
        ) AS Total_QOH
      FROM dbo.tblQOH q
      INNER JOIN dbo.tblProductsMaster pm ON q.SKU = pm.SKU
      INNER JOIN dbo.tblProductCrossReferences pcr 
        ON pm.PrefSupp = pcr.Supplier AND pm.SKU = pcr.GSS_SKU
      INNER JOIN dbo.tblScrapedData sd ON pcr.Supplier_SKU = sd.Scraped_Supplier_SKU
      WHERE (
        q.QOH_A1 + q.QOH_AAD + q.QOH_AAP + 
        q.QOH_APW + q.QOH_ACS_A + q.QOH_ACS_S + 
        q.QOH_DBA_SYD + q.QOH_KAILOS + q.QOH_GSS + 
        q.QOH_PAT_SYD + q.QOH_PAT_MEL
      ) >= 1
      GROUP BY sd.Scraped_Brand
      ORDER BY COUNT(pm.SKU) DESC
    `);
    
    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  }
}
