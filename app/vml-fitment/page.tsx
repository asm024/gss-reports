'use client';

import { useState, useEffect } from 'react';

interface Summary {
  FitmentMissingVML: number;
  ProductsNoFitRef: number;
  IncompleteKtypes: number;
  TotalIncompleteEPIDs: number;
}

interface FitmentByKtype {
  ktype: number;
  FitmentRecords: number;
}

interface ProductNoFitRef {
  SKU: string;
  Title: string;
  Brand: number | null;
  Category: number | null;
}

interface VMLIncomplete {
  ktype: number;
  EPIDCount: number;
}

export default function VMLFitmentPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [fitmentByKtype, setFitmentByKtype] = useState<FitmentByKtype[]>([]);
  const [productsNoFitRef, setProductsNoFitRef] = useState<ProductNoFitRef[]>([]);
  const [vmlIncomplete, setVmlIncomplete] = useState<VMLIncomplete[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'fitment' | 'products' | 'vml'>('fitment');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sumRes, fitRes, prodRes, vmlRes] = await Promise.all([
        fetch('/api/vml-fitment/summary'),
        fetch('/api/vml-fitment/fitment-missing-vml'),
        fetch('/api/vml-fitment/products-no-fitref'),
        fetch('/api/vml-fitment/vml-incomplete'),
      ]);
      
      setSummary(await sumRes.json());
      setFitmentByKtype(await fitRes.json());
      setProductsNoFitRef(await prodRes.json());
      setVmlIncomplete(await vmlRes.json());
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const exportCSV = (data: any[], filename: string) => {
    if (!data.length) return;
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(row => headers.map(h => `"${row[h] ?? ''}"`).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  return (
    <main className="min-h-screen bg-[#1a1a1a] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
 <div>
  <a href="/" className="text-[#9ca3af] hover:text-[#a78bfa] text-sm mb-2 inline-block">&larr; Back to Home</a>
  <h1 className="text-3xl font-bold text-[#a78bfa]">VML & Fitment Dashboard</h1>
  <p className="text-[#9ca3af]">Track VML completion and fitment coverage</p>
</div>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-[#a78bfa] text-black font-semibold rounded-lg hover:bg-[#c4b5fd] transition-colors"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="text-[#9ca3af]">Loading...</p>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-[#2a2a2a] border border-[#3f3f3f] rounded-xl p-5">
                <p className="text-[#9ca3af] text-sm">Fitment Missing VML</p>
                <p className="text-2xl font-bold text-red-400">{summary?.FitmentMissingVML?.toLocaleString()}</p>
              </div>
              <div className="bg-[#2a2a2a] border border-[#3f3f3f] rounded-xl p-5">
                <p className="text-[#9ca3af] text-sm">Products No FitRef</p>
                <p className="text-2xl font-bold text-orange-400">{summary?.ProductsNoFitRef?.toLocaleString()}</p>
              </div>
              <div className="bg-[#2a2a2a] border border-[#3f3f3f] rounded-xl p-5">
                <p className="text-[#9ca3af] text-sm">Incomplete Ktypes</p>
                <p className="text-2xl font-bold text-[#f5c518]">{summary?.IncompleteKtypes?.toLocaleString()}</p>
              </div>
              <div className="bg-[#2a2a2a] border border-[#3f3f3f] rounded-xl p-5">
                <p className="text-[#9ca3af] text-sm">Total Incomplete EPIDs</p>
                <p className="text-2xl font-bold text-[#a78bfa]">{summary?.TotalIncompleteEPIDs?.toLocaleString()}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              {[
                { key: 'fitment', label: 'Fitment by Ktype' },
                { key: 'products', label: 'Products No FitRef' },
                { key: 'vml', label: 'VML Incomplete' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'bg-[#a78bfa] text-black'
                      : 'bg-[#2a2a2a] text-[#9ca3af] hover:bg-[#3a3a3a]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tables */}
            <div className="bg-[#2a2a2a] border border-[#3f3f3f] rounded-xl overflow-hidden">
              {activeTab === 'fitment' && (
                <>
                  <div className="flex justify-between items-center p-4 border-b border-[#3f3f3f]">
                    <h3 className="text-lg font-semibold text-[#f5f5f5]">Fitment Records by Ktype (Missing VML)</h3>
                    <button onClick={() => exportCSV(fitmentByKtype, 'fitment-missing-vml.csv')} className="px-3 py-1 bg-[#3f3f3f] text-[#9ca3af] rounded hover:bg-[#4f4f4f] text-sm">Export CSV</button>
                  </div>
                  <div className="overflow-auto" style={ { maxHeight: 'calc(100vh - 500px)', minHeight: '300px' }  }>
                    
                    <table className="w-full">
                      <thead className="bg-[#1a1a1a] sticky top-0">
                        <tr>
                          <th className="text-left p-3 text-[#9ca3af] font-medium">Ktype</th>
                          <th className="text-right p-3 text-[#9ca3af] font-medium">Fitment Records</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fitmentByKtype.map((row, i) => (
                          <tr key={i} className="border-t border-[#3f3f3f] hover:bg-[#3a3a3a]">
                            <td className="p-3 text-[#f5f5f5]">{row.ktype}</td>
                            <td className="p-3 text-[#f5f5f5] text-right">{row.FitmentRecords.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {activeTab === 'products' && (
                <>
                  <div className="flex justify-between items-center p-4 border-b border-[#3f3f3f]">
                    <h3 className="text-lg font-semibold text-[#f5f5f5]">Products Without FitRef</h3>
                    <button onClick={() => exportCSV(productsNoFitRef, 'products-no-fitref.csv')} className="px-3 py-1 bg-[#3f3f3f] text-[#9ca3af] rounded hover:bg-[#4f4f4f] text-sm">Export CSV</button>
                  </div>
                  <div className="overflow-auto" style={ { maxHeight: 'calc(100vh - 500px)', minHeight: '300px' }  }>
                    <table className="w-full">
                      <thead className="bg-[#1a1a1a] sticky top-0">
                        <tr>
                          <th className="text-left p-3 text-[#9ca3af] font-medium">SKU</th>
                          <th className="text-left p-3 text-[#9ca3af] font-medium">Title</th>
                          <th className="text-left p-3 text-[#9ca3af] font-medium">Brand</th>
                          <th className="text-left p-3 text-[#9ca3af] font-medium">Category</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productsNoFitRef.map((row, i) => (
                          <tr key={i} className="border-t border-[#3f3f3f] hover:bg-[#3a3a3a]">
                            <td className="p-3 text-[#a78bfa] font-mono text-sm">{row.SKU}</td>
                            <td className="p-3 text-[#f5f5f5]">{row.Title}</td>
<td className="p-3 text-[#f5f5f5]">{row.Brand}</td>
<td className="p-3 text-[#f5f5f5]">{row.Category}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {activeTab === 'vml' && (
                <>
                  <div className="flex justify-between items-center p-4 border-b border-[#3f3f3f]">
                    <h3 className="text-lg font-semibold text-[#f5f5f5]">VML Incomplete by Ktype</h3>
                    <button onClick={() => exportCSV(vmlIncomplete, 'vml-incomplete.csv')} className="px-3 py-1 bg-[#3f3f3f] text-[#9ca3af] rounded hover:bg-[#4f4f4f] text-sm">Export CSV</button>
                  </div>
                  <div className="overflow-auto" style={ { maxHeight: 'calc(100vh - 500px)', minHeight: '300px' }  }>
                    <table className="w-full">
                      <thead className="bg-[#1a1a1a] sticky top-0">
                        <tr>
                          <th className="text-left p-3 text-[#9ca3af] font-medium">Ktype</th>
                          <th className="text-right p-3 text-[#9ca3af] font-medium">EPID Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vmlIncomplete.map((row, i) => (
                          <tr key={i} className="border-t border-[#3f3f3f] hover:bg-[#3a3a3a]">
                            <td className="p-3 text-[#f5f5f5]">{row.ktype}</td>
                            <td className="p-3 text-[#f5f5f5] text-right">{row.EPIDCount.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <p className="text-center text-[#4a4a4a] text-sm mt-8">
          Made by Grace, for Adam 💛💜
        </p>
      </div>
    </main>
  );
}