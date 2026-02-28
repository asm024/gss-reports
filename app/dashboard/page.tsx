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
  { title: 'GPT Done - No Package', desc: 'GPT processed, missing package type', href: '/gpt-no-package', accent: '#6b7280' },
  { title: 'GPT Done - No Category', desc: 'GPT processed, missing category', href: '/gpt-no-category', accent: '#6b7280' },
];

const cardStyle = (accent: string) => ({
  display: 'block' as const,
  background: '#2a2a2a',
  border: '1px solid #3f3f3f',
  borderTop: `3px solid ${accent}`,
  borderRadius: '8px',
  padding: '20px',
  textDecoration: 'none',
  color: '#f5f5f5',
});

const s = {
  page: { background: '#1a1a1a', minHeight: '100vh', padding: '32px', color: '#f5f5f5', fontFamily: 'sans-serif' },
  header: { marginBottom: '40px' },
  h1: { fontSize: '28px', fontWeight: '700' as const, color: '#f5c518', margin: 0 },
  sub: { color: '#9ca3af', marginTop: '6px', fontSize: '14px' },
  section: { marginBottom: '48px' },
  sectionTitle: { fontSize: '16px', fontWeight: '600' as const, color: '#a78bfa', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: '16px' },
  reportGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' },
  cardTitle: { fontWeight: '600' as const, fontSize: '15px', marginBottom: '6px' },
  cardDesc: { fontSize: '13px', color: '#9ca3af' },
  toolsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' },
  formCard: { background: '#2a2a2a', border: '1px solid #3f3f3f', borderTop: '3px solid #f5c518', borderRadius: '8px', overflow: 'hidden' as const },
  formHeader: { padding: '16px 20px', borderBottom: '1px solid #3f3f3f' },
  formTitle: { fontWeight: '600' as const, fontSize: '15px' },
  formDesc: { fontSize: '13px', color: '#9ca3af', marginTop: '4px' },
  iframe: { width: '100%', height: '500px', border: 'none', background: '#1a1a1a' } as React.CSSProperties,
  powerCard: { background: '#2a2a2a', border: '1px solid #3f3f3f', borderTop: '3px solid #a78bfa', borderRadius: '8px', padding: '20px' },
  powerDesc: { fontSize: '13px', color: '#9ca3af', marginBottom: '20px' },
  btn: { display: 'inline-block', background: '#a78bfa', color: '#1a1a1a', fontWeight: '600' as const, fontSize: '14px', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none' },
  footer: { borderTop: '1px solid #3f3f3f', paddingTop: '20px', textAlign: 'center' as const, fontSize: '13px', color: '#6b7280' },
};

export default function Dashboard() {
  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.h1}>GSS Master Dashboard</h1>
        <p style={s.sub}>Reports · Tools · Apps</p>
      </div>

      <section style={s.section}>
        <h2 style={s.sectionTitle}>Reports</h2>
        <div style={s.reportGrid}>
          {reports.map((r) => (
            <a key={r.href} href={r.href} style={cardStyle(r.accent)}>
              <div style={s.cardTitle}>{r.title}</div>
              <div style={s.cardDesc}>{r.desc}</div>
            </a>
          ))}
        </div>
      </section>

      <section style={s.section}>
        <h2 style={s.sectionTitle}>Tools</h2>
        <div style={s.toolsGrid}>
          <div style={s.formCard}>
            <div style={s.formHeader}>
              <div style={s.formTitle}>Product Import</div>
              <div style={s.formDesc}>Add SKUs to Product Content Review</div>
            </div>
            <iframe src={N8N_FORM_URL} style={s.iframe} title="Product Import Form" />
          </div>
          <div style={s.powerCard}>
            <div style={s.cardTitle}>GSS Master App</div>
            <div style={s.powerDesc}>Power Apps — opens in new tab</div>
            <a href={https://apps.powerapps.com/play/e/d382cd7d-c3c6-e159-b362-550f357cf9c0/a/a82eeffe-ce6a-4ee9-b82b-e70e6afde695?tenantId=167c4e48-4c87-491c-a38e-d1a94f6cbafc&source=curatedApps&sourcetime=1770542287365} target="_blank" rel="noopener noreferrer" style={s.btn}>
              Open in Power Apps →
            </a>
          </div>
        </div>
      </section>

      <div style={s.footer}>
        Made by Grace, for Adam 💛💜
      </div>
    </div>
  );
}
