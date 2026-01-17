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
    if (sortKey !== column) return <span className="text-zinc-500 ml-1">↕</span>;
    return <span className="ml-1 text-amber-500">{sortAsc ? '↑' : '↓'}</span>;
  };

  const totalSKUs = data.reduce((sum, row) => sum + row.SKU_Count, 0);
  const totalQOH = data.reduce((sum, row) => sum + row.Total_QOH, 0);

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Brand Stock Report</h1>
            {lastUpdated && (
              <p className="text-zinc-500 text-sm mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={fetchData} 
              disabled={loading}
              className="px-4 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-600 disabled:bg-zinc-800 disabled:text-zinc-500 transition"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
            
            <button 
              onClick={exportCSV}
              disabled={loading || data.length === 0}
              className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-500 disabled:bg-zinc-800 disabled:text-zinc-500 transition"
            >
              Export CSV
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded mb-6">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                <p className="text-zinc-400 text-sm uppercase tracking-wide">Brands</p>
                <p className="text-3xl font-bold text-white">{data.length.toLocaleString()}</p>
              </div>
              <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                <p className="text-zinc-400 text-sm uppercase tracking-wide">Total SKUs</p>
                <p className="text-3xl font-bold text-amber-500">{totalSKUs.toLocaleString()}</p>
              </div>
              <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                <p className="text-zinc-400 text-sm uppercase tracking-wide">Total QOH</p>
                <p className="text-3xl font-bold text-white">{totalQOH.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="sticky top-0">
                    <tr className="bg-zinc-900 border-b border-zinc-700">
                      <th 
                        className="p-3 text-left cursor-pointer hover:bg-zinc-800 transition text-zinc-300 font-semibold"
                        onClick={() => handleSort('Scraped_Brand')}
                      >
                        Brand <SortIcon column="Scraped_Brand" />
                      </th>
                      <th 
                        className="p-3 text-left cursor-pointer hover:bg-zinc-800 transition text-zinc-300 font-semibold"
                        onClick={() => handleSort('Scraped_Supplier')}
                      >
                        Supplier <SortIcon column="Scraped_Supplier" />
                      </th>
                      <th 
                        className="p-3 text-right cursor-pointer hover:bg-zinc-800 transition text-zinc-300 font-semibold"
                        onClick={() => handleSort('SKU_Count')}
                      >
                        SKU Count <SortIcon column="SKU_Count" />
                      </th>
                      <th 
                        className="p-3 text-right cursor-pointer hover:bg-zinc-800 transition text-zinc-300 font-semibold"
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
                        className={`border-b border-zinc-700/50 hover:bg-zinc-700/30 transition ${
                          i % 2 === 0 ? 'bg-zinc-800/50' : 'bg-zinc-800'
                        }`}
                      >
                        <td className="p-3 font-medium">{row.Scraped_Brand}</td>
                        <td className="p-3 text-zinc-400">{row.Scraped_Supplier}</td>
                        <td className="p-3 text-right font-mono">{row.SKU_Count.toLocaleString()}</td>
                        <td className="p-3 text-right font-mono">{row.Total_QOH.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
