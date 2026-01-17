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
    if (sortKey !== column) return <span className="text-[#9ca3af]/50 ml-1">↕</span>;
    return <span className="ml-1 text-[#a78bfa]">{sortAsc ? '↑' : '↓'}</span>;
  };

  const totalSKUs = data.reduce((sum, row) => sum + row.SKU_Count, 0);
  const totalQOH = data.reduce((sum, row) => sum + row.Total_QOH, 0);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#f5f5f5] p-8 font-sans">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#f5c518] tracking-tight">
              Brand Stock Report
            </h1>
            {lastUpdated && (
              <p className="text-[#a78bfa] text-sm mt-1">
                Updated {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-5 py-2.5 bg-[#2a2a2a] text-[#f5f5f5] rounded-xl border border-[#3f3f3f] hover:border-[#a78bfa] hover:text-[#a78bfa] disabled:opacity-50 transition-all duration-200"
            >
              {loading ? '...' : 'Refresh'}
            </button>

            <button
              onClick={exportCSV}
              disabled={loading || data.length === 0}
              className="px-5 py-2.5 bg-[#f5c518] text-[#1a1a1a] font-semibold rounded-xl hover:bg-[#fcd34d] disabled:opacity-50 transition-all duration-200"
            >
              Export CSV
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-3 gap-5 mb-8">
              <div className="bg-[#2a2a2a] border border-[#3f3f3f] rounded-xl p-5">
                <p className="text-[#a78bfa] text-xs uppercase tracking-widest font-medium">Brands</p>
                <p className="text-4xl font-bold text-[#f5f5f5] mt-1">{data.length.toLocaleString()}</p>
              </div>
              <div className="bg-[#2a2a2a] border border-[#3f3f3f] rounded-xl p-5 border-l-4 border-l-[#f5c518]">
                <p className="text-[#a78bfa] text-xs uppercase tracking-widest font-medium">Total SKUs</p>
                <p className="text-4xl font-bold text-[#f5c518] mt-1">{totalSKUs.toLocaleString()}</p>
              </div>
              <div className="bg-[#2a2a2a] border border-[#3f3f3f] rounded-xl p-5">
                <p className="text-[#a78bfa] text-xs uppercase tracking-widest font-medium">Total QOH</p>
                <p className="text-4xl font-bold text-[#f5f5f5] mt-1">{totalQOH.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-[#2a2a2a] border border-[#3f3f3f] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#3f3f3f]">
                      <th
                        className="p-4 text-left cursor-pointer hover:bg-[#3a3a3a] transition text-[#a78bfa] font-medium text-sm uppercase tracking-wider"
                        onClick={() => handleSort('Scraped_Brand')}
                      >
                        Brand <SortIcon column="Scraped_Brand" />
                      </th>
                      <th
                        className="p-4 text-left cursor-pointer hover:bg-[#3a3a3a] transition text-[#a78bfa] font-medium text-sm uppercase tracking-wider"
                        onClick={() => handleSort('Scraped_Supplier')}
                      >
                        Supplier <SortIcon column="Scraped_Supplier" />
                      </th>
                      <th
                        className="p-4 text-right cursor-pointer hover:bg-[#3a3a3a] transition text-[#a78bfa] font-medium text-sm uppercase tracking-wider"
                        onClick={() => handleSort('SKU_Count')}
                      >
                        SKU Count <SortIcon column="SKU_Count" />
                      </th>
                      <th
                        className="p-4 text-right cursor-pointer hover:bg-[#3a3a3a] transition text-[#a78bfa] font-medium text-sm uppercase tracking-wider"
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
                        className="border-b border-[#3f3f3f]/50 hover:bg-[#3a3a3a]/50 transition-colors duration-150"
                      >
                        <td className="p-4 font-medium text-[#f5f5f5]">{row.Scraped_Brand}</td>
                        <td className="p-4 text-[#9ca3af]">{row.Scraped_Supplier}</td>
                        <td className="p-4 text-right text-[#f5f5f5]">{row.SKU_Count.toLocaleString()}</td>
                        <td className="p-4 text-right text-[#f5f5f5]">{row.Total_QOH.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-center text-[#9ca3af] text-sm mt-6">
              Made by Grace, for Adam 💛💜
            </p>
          </>
        )}
      </div>
    </div>
  );
}