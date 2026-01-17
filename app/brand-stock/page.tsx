'use client';

import { useState, useEffect } from 'react';

interface BrandRow {
  ID: number;
  Scraped_Supplier: string;
  Scraped_Brand: string;
  SKU_Count: number;
  Total_QOH: number;
}

type SortKey = 'Scraped_Brand' | 'Scraped_Supplier' | 'SKU_Count' | 'Total_QOH';

export default function BrandStockReport() {
  const [data, setData] = useState<BrandRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('SKU_Count');
  const [sortAsc, setSortAsc] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/brand-stock');
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setData(json);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const sortedData = [...data].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortAsc ? aVal - bVal : bVal - aVal;
    }
    return sortAsc 
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const exportCSV = () => {
    const headers = ['Brand', 'Supplier', 'SKU Count', 'Total QOH'];
    const rows = sortedData.map(row => [
      row.Scraped_Brand,
      row.Scraped_Supplier,
      row.SKU_Count,
      row.Total_QOH
    ]);
    
    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brand-stock-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <span className="text-violet-300/50 ml-1">↕</span>;
    return <span className="ml-1 text-violet-500">{sortAsc ? '↑' : '↓'}</span>;
  };

  const totalSKUs = data.reduce((sum, row) => sum + row.SKU_Count, 0);
  const totalQOH = data.reduce((sum, row) => sum + row.Total_QOH, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-rose-50 text-slate-700 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-light text-slate-800 tracking-tight">
              Brand Stock Report
            </h1>
            {lastUpdated && (
              <p className="text-violet-400 text-sm mt-1 font-light">
                Updated {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={fetchData} 
              disabled={loading}
              className="px-5 py-2.5 bg-white text-slate-600 rounded-full shadow-sm border border-slate-200 hover:border-violet-300 hover:shadow-md disabled:opacity-50 transition-all duration-200"
            >
              {loading ? '...' : 'Refresh'}
            </button>
            
            <button 
              onClick={exportCSV}
              disabled={loading || data.length === 0}
              className="px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-full shadow-md hover:shadow-lg hover:from-violet-600 hover:to-purple-600 disabled:opacity-50 transition-all duration-200"
            >
              Export CSV
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-2xl mb-6">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-3 gap-5 mb-8">
              <div className="bg-white/70 backdrop-blur-sm border border-white rounded-2xl p-5 shadow-sm">
                <p className="text-violet-400 text-xs uppercase tracking-widest font-medium">Brands</p>
                <p className="text-4xl font-light text-slate-800 mt-1">{data.length.toLocaleString()}</p>
              </div>
              <div className="bg-white/70 backdrop-blur-sm border border-white rounded-2xl p-5 shadow-sm">
                <p className="text-violet-400 text-xs uppercase tracking-widest font-medium">Total SKUs</p>
                <p className="text-4xl font-light text-violet-600 mt-1">{totalSKUs.toLocaleString()}</p>
              </div>
              <div className="bg-white/70 backdrop-blur-sm border border-white rounded-2xl p-5 shadow-sm">
                <p className="text-violet-400 text-xs uppercase tracking-widest font-medium">Total QOH</p>
                <p className="text-4xl font-light text-slate-800 mt-1">{totalQOH.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-white rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-violet-100">
                      <th 
                        className="p-4 text-left cursor-pointer hover:bg-violet-50/50 transition text-violet-400 font-medium text-sm uppercase tracking-wider"
                        onClick={() => handleSort('Scraped_Brand')}
                      >
                        Brand <SortIcon column="Scraped_Brand" />
                      </th>
                      <th 
                        className="p-4 text-left cursor-pointer hover:bg-violet-50/50 transition text-violet-400 font-medium text-sm uppercase tracking-wider"
                        onClick={() => handleSort('Scraped_Supplier')}
                      >
                        Supplier <SortIcon column="Scraped_Supplier" />
                      </th>
                      <th 
                        className="p-4 text-right cursor-pointer hover:bg-violet-50/50 transition text-violet-400 font-medium text-sm uppercase tracking-wider"
                        onClick={() => handleSort('SKU_Count')}
                      >
                        SKU Count <SortIcon column="SKU_Count" />
                      </th>
                      <th 
                        className="p-4 text-right cursor-pointer hover:bg-violet-50/50 transition text-violet-400 font-medium text-sm uppercase tracking-wider"
                        onClick={() => handleSort('Total_QOH')}
                      >
                        Total QOH <SortIcon column="Total_QOH" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedData.map((row, i) => (
                      <tr 
                        key={i} 
                        className="border-b border-slate-100/50 hover:bg-violet-50/30 transition-colors duration-150"
                      >
                        <td className="p-4 font-medium text-slate-700">{row.Scraped_Brand}</td>
                        <td className="p-4 text-slate-400">{row.Scraped_Supplier}</td>
                        <td className="p-4 text-right font-light text-slate-600">{row.SKU_Count.toLocaleString()}</td>
                        <td className="p-4 text-right font-light text-slate-600">{row.Total_QOH.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <p className="text-center text-violet-300 text-sm mt-6 font-light">
              ✨ Made with love
            </p>
          </>
        )}
      </div>
    </div>
  );
}
