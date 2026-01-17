'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ProductRow {
  SKU: string;
  Description: string;
}

type SortKey = 'SKU' | 'Description';

export default function GPTNoCategoryReport() {
  const [data, setData] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('SKU');
  const [sortAsc, setSortAsc] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/gpt-no-category');
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

  useEffect(() => { fetchData(); }, []);

  const sortedData = [...data].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    return sortAsc ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) { setSortAsc(!sortAsc); } 
    else { setSortKey(key); setSortAsc(true); }
  };

  const exportCSV = () => {
    const headers = ['SKU', 'Description'];
    const rows = sortedData.map(row => [row.SKU, row.Description]);
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gpt-no-category-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <span className="text-[#9ca3af]/50 ml-1">↕</span>;
    return <span className="ml-1 text-[#a78bfa]">{sortAsc ? '↑' : '↓'}</span>;
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#f5f5f5] p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="text-[#a78bfa] hover:text-[#c4b5fd] text-sm mb-1 inline-block">← Back</Link>
            <h1 className="text-3xl font-bold text-[#f5c518] tracking-tight">Products with GPT Done - No Category</h1>
            {lastUpdated && <p className="text-[#a78bfa] text-sm mt-1">Updated {lastUpdated.toLocaleTimeString()}</p>}
          </div>
          <div className="flex gap-3">
            <button onClick={fetchData} disabled={loading} className="px-5 py-2.5 bg-[#2a2a2a] text-[#f5f5f5] rounded-xl border border-[#3f3f3f] hover:border-[#a78bfa] hover:text-[#a78bfa] disabled:opacity-50 transition-all duration-200">{loading ? '...' : 'Refresh'}</button>
            <button onClick={exportCSV} disabled={loading || data.length === 0} className="px-5 py-2.5 bg-[#f5c518] text-[#1a1a1a] font-semibold rounded-xl hover:bg-[#fcd34d] disabled:opacity-50 transition-all duration-200">Export CSV</button>
          </div>
        </div>
        {error && <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6">{error}</div>}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 gap-5 mb-8">
              <div className="bg-[#2a2a2a] border border-[#3f3f3f] rounded-xl p-5 border-l-4 border-l-[#f5c518]">
                <p className="text-[#a78bfa] text-xs uppercase tracking-widest font-medium">Products</p>
                <p className="text-4xl font-bold text-[#f5c518] mt-1">{data.length.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-[#2a2a2a] border border-[#3f3f3f] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#3f3f3f]">
                      <th className="p-4 text-left cursor-pointer hover:bg-[#3a3a3a] transition text-[#a78bfa] font-medium text-sm uppercase tracking-wider" onClick={() => handleSort('SKU')}>SKU <SortIcon column="SKU" /></th>
                      <th className="p-4 text-left cursor-pointer hover:bg-[#3a3a3a] transition text-[#a78bfa] font-medium text-sm uppercase tracking-wider" onClick={() => handleSort('Description')}>Description <SortIcon column="Description" /></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedData.map((row, i) => (
                      <tr key={i} className="border-b border-[#3f3f3f]/50 hover:bg-[#3a3a3a]/50 transition-colors duration-150">
                        <td className="p-4 font-mono text-sm text-[#f5f5f5]">{row.SKU}</td>
                        <td className="p-4 text-[#f5f5f5]">{row.Description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-center text-[#9ca3af] text-sm mt-6">Made by Grace, for Adam 💛💜</p>
          </>
        )}
      </div>
    </div>
  );
}
