'use client';

const N8N_FORM_URL = 'N8N_FORM_URL_HERE';
const POWER_APPS_URL = 'POWER_APPS_URL_HERE';

const reports = [
  { title: 'Brand Stock', desc: 'SKU count and QOH by brand', href: '/brand-stock', accent: '#f5c518' },
  { title: 'Dead Stock', desc: 'Items unsold for 3+ years', href: '/dead-stock', accent: '#ef4444' },
  { title: 'Dead Stock — Not on eBay', desc: 'Not yet listed for clearance', href: '/dead-stock-unlisted', accent: '#f97316' },
  { title: 'Overstocked', desc: 'Items exceeding max stock level', href: '/overstocked', accent: '#a78bfa' },
  { title: 'No Category', desc: 'In-stock products with no category', href: '/no-category', accent: '#6b7280' },
  { title: 'TBA Brand', desc: 'Products needing brand assignment', href: '/tba-brand', accent: '#6b7280' },
  { title: 'No Package', desc: 'Products missing package type', href: '/no-package', accent: '#6b7280' },
  { title: 'GPT Done — No Package', desc: 'GPT processed, missing package type', href: '/gpt-no-package', accent: '#6b7280' },
  { title: 'GPT Done — No Category', desc: 'GPT processed, missing category', href: '/gpt-no-category', accent: '#6b7280' },
];

export default function Dashboard() {
  return (
    <div style= background: '#1a1a1a', minHeight: '100vh', padding: '32px', color: '#f5f5f5', fontFamily: 'sans-serif' >

      <div style= marginBottom: '40px' >
        <h1 style= fontSize: '28px', fontWeight: '700', color: '#f5c518', margin: 0 >GSS Master Dashboard</h1>
        <p style= color: '#9ca3af', marginTop: '6px', fontSize: '14px', margin: '6px 0 0' >Reports · Tools · Apps</p>
      </div>

      <section style= marginBottom: '48px' >
        <h2 style= fontSize: '13px', fontWeight: '600', color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' >Reports</h2>
        <div style= display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' >
          {reports.map((r) => (
            <a key={r.href} href={r.href} style={{ display: 'block', background: '#2a2a2a', border: '1px solid #3f3f3f', borderTop: `3px solid ${r.accent}`, borderRadius: '8px', padding: '20px', textDecoration: 'none', color: '#f5f5f5' }}>
              <div style= fontWeight: '600', fontSize: '15px', marginBottom: '6px' >{r.title}</div>
              <div style= fontSize: '13px', color: '#9ca3af' >{r.desc}</div>
            </a>
          ))}
        </div>
      </section>

      <section style= marginBottom: '48px' >
        <h2 style= fontSize: '13px', fontWeight: '600', color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' >Tools</h2>
        <div style= display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' >

          <div style= background: '#2a2a2a', border: '1px solid #3f3f3f', borderTop: '3px solid #f5c518', borderRadius: '8px', overflow: 'hidden' >
            <div style= padding: '16px 20px', borderBottom: '1px solid #3f3f3f' >
              <div style= fontWeight: '600', fontSize: '15px' >Product Import</div>
              <div style= fontSize: '13px', color: '#9ca3af', marginTop: '4px' >Add SKUs to Product Content Review</div>
            </div>
            <iframe src={N8N_FORM_URL} style= width: '100%', height: '500px', border: 'none'  title="Product Import Form" />
          </div>

          <div style= background: '#2a2a2a', border: '1px solid #3f3f3f', borderTop: '3px solid #a78bfa', borderRadius: '8px', padding: '20px' >
            <div style= fontWeight: '600', fontSize: '15px', marginBottom: '6px' >GSS Master App</div>
            <div style= fontSize: '13px', color: '#9ca3af', marginBottom: '20px' >Power Apps — opens in new tab</div>
            <a href={POWER_APPS_URL} target="_blank" rel="noopener noreferrer" style= display: 'inline-block', background: '#a78bfa', color: '#1a1a1a', fontWeight: '600', fontSize: '14px', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none' >
              Open in Power Apps →
            </a>
          </div>

        </div>
      </section>

      <div style= borderTop: '1px solid #3f3f3f', paddingTop: '20px', textAlign: 'center', fontSize: '13px', color: '#6b7280' >
        Made by Grace, for Adam 💛💜
      </div>

    </div>
  );
}
