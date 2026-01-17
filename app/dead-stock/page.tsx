'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Summary {
  TotalSKUs: number;
  TotalValue: number;
  TotalUnits: number;
  NeverSold: number;
}

interface BreakdownRow {
  Brand?: string;
  Category?: string;
  AgeBracket?: string;
  SKUCount: number;
  TotalValue: number;
  TotalUnits: number;
}

interface ListRow {
  SKU: string;
  Title: string;
  Brand: string;
  Category: string;
  Location: string;
  Stock: number;
  StockValue: number;
  LastSaleDate: string | null;
  DaysSinceSale: number | null;
  AgeBracket: string;
}

type ListSortKey = 'SKU' | 'Title' | 'Brand' | 'Category' | 'Stock' | 'StockValue' | 'DaysSinceSale';

export default function DeadStockDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [byBrand, setByBrand] = useState<BreakdownRow[]>([]);
  const [byCategory, setByCategory] = useState<BreakdownRow[]>([]);
  const [byAge, setByAge] = useState<BreakdownRow[]>([]);
  const [list, setList] = useState<ListRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortKey, setSortKey] = useState<ListSortKey>('StockValue');
  const [sortAsc, setSortAsc] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<'brand' | 'category' | 'age'>('brand');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [sumRes, brandRes, catRes, ageRes, listRes] = await Promise.all([
        fetch('/api/dead-stock/summary'),
        fetch('/api/dead-stock/by-brand'),
        fetch('/api/dead-stock/by-category'),
        fetch('/api/dead-stock/by-age'),
        fetch('/api/dead-stock/list'),
      ]);
      if (!sumRes.ok || !brandRes.ok || !catRes.ok || !ageRes.ok || !listRes.ok) throw new Error('Failed to fetch');
      setSummary(await sumRes.json());
      setByBrand(await brandRes.json());
      setByCategory(await catRes.json());
      setByAge(await ageRes.json());
      setList(await listRes.json());
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const sortedList = [...list].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (aVal === null) return 1;
    if (bVal === null) return -1;
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortAsc ? aVal - bVal : bVal - aVal;
    }
    return sortAsc ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
  });

  const handleSort = (key: ListSortKey) => {
    if (sortKey === key) { setSortAsc(!sortAsc); } 
    else { setSortKey(key); setSortAsc(false); }
  };

  const exportCSV = () => {
    const headers = ['SKU', 'Title', 'Brand', 'Category', 'Location', 'Stock', 'Value', 'Last Sale', 'Days Since Sale', 'Age Bracket'];
    const rows = sortedList.map(row => [row.SKU, row.Title, row.Brand, row.Category, row.Location, row.Stock, row.StockValue, row.LastSaleDate || 'Never', row.DaysSinceSale || '', row.AgeBracket]);
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dead-stock-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (val: number) => `$${val?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`;

  const SortIcon = ({ column }: { column: ListSortKey }) => {
    if (sortKey !== column) return <span className="text-[#9ca3af]/50 ml-1">↕</span>;
    return <span className="ml-1 text-[#a78bfa]">{sortAsc ? '↑' : '↓'}</span>;
  };

  const breakdownData = activeTab === 'brand' ? byBrand : activeTab === 'category' ? byCategory : byAge;
  const breakdownLabel = activeTab === 'brand' ? 'Brand' : activeTab === 'category' ? 'Category' : 'Age Bracket';

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#f5f5f5] p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="text-[#a78bfa] hover:text-[#c4b5fd] text-sm mb-1 inline-block">← Back</Link>
            <h1 className="text-3xl font-bold text-[#f5c518] tracking-tight">Dead Stock Dashboard</h1>
            {lastUpdated && <p className="text-[#a78bfa] text-sm mt-1">Updated {lastUpdated.toLocaleTimeString()}</p>}
          </div>
          <button onClick={fetchData} disabled={loading} className="px-5 py-2.5 bg-[#2a2a2a] text-[#f5f5f5] rounded-xl border border-[#3f3f3f] hover:border-[#a78bfa] hover:text-[#a78bfa] disabled:opacity-50 transition-all duration-200">{loading ? '...' : 'Refresh'}</button>
        </div>

        {error && <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6">{error}</div>}

        {!loading && !error && summary && (
          <>
            <div className="grid grid-cols-4 gap-5 mb-8">
              <div className="bg-[#2a2a2a] border border-[#3f3f3f] rounded-xl p-5 border-l-4 border-l-[#f5c518]">
                <p className="text-[#a78bfa] text-xs uppercase tracking-widest font-medium">Dead SKUs</p>
                <p className="text-4xl font-bold text-[#f5c518] mt-1">{summary.TotalSKUs.toLocaleString()}</p>
              </div>
              <div className="bg-[#2a2a2a] border border-[#3f3f3f] rounded-xl p-5">
                <p className="text-[#a78bfa] text-xs uppercase tracking-widest font-medium">Total Value</p>
                <p className="text-4xl font-bold text-[#f5f5f5] mt-1">{formatCurrency(summary.TotalValue)}</p>
              </div>
              <div className="bg-[#2a2a2a] border border-[#3f3f3f] rounded-xl p-5">
                <p className="text-[#a78bfa] text-xs uppercase tracking-widest font-medium">Total Units</p>
                <p className="text-4xl font-bold text-[#f5f5f5] mt-1">{summary.TotalUnits.toLocaleString()}</p>
              </div>
              <div className="bg-[#2a2a2a] border border-[#3f3f3f] rounded-xl p-5 border-l-4 border-l-red-500">
                <p className="text-[#a78bfa] text-xs uppercase tracking-widest font-medium">Never Sold</p>
                <p className="text-4xl font-bold text-red-400 mt-1">{summary.NeverSold.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-[#2a2a2a] border border-[#3f3f3f] rounded-xl p-5 mb-8">
              <div className="flex gap-2 mb-4">
                <button onClick={() => setActiveTab('brand')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'brand' ? 'bg-[#f5c518] text-[#1a1a1a]' : 'bg-[#3a3a3a] text-[#9ca3af] hover:text-[#f5f5f5]'}`}>By Brand</button>
                <button onClick={() => setActiveTab('category')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'category' ? 'bg-[#f5c518] text-[#1a1a1a]' : 'bg-[#3a3a3a] text-[#9ca3af] hover:text-[#f5f5f5]'}`}>By Category</button>
                <button onClick={() => setActiveTab('age')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'age' ? 'bg-[#f5c518] text-[#1a1a1a]' : 'bg-[#3a3a3a] text-[#9ca3af] hover:text-[#f5f5f5]'}`}>By Age</button>
              </div>
              <div className="overflow-x-auto max-h-80 overflow-y-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-[#2a2a2a]">
                    <tr className="border-b border-[#3f3f3f]">
                      <th className="p-3 text-left text-[#a78bfa] font-medium text-sm uppercase tracking-wider">{breakdownLabel}</th>
                      <th className="p-3 text-right text-[#a78bfa] font-medium text-sm uppercase tracking-wider">SKUs</th>
                      <th className="p-3 text-right text-[#a78bfa] font-medium text-sm uppercase tracking-wider">Value</th>
                      <th className="p-3 text-right text-[#a78bfa] font-medium text-sm uppercase tracking-wider">Units</th>
                    </tr>
                  </thead>
                  <tbody>
                    {breakdownData.map((row, i) => (
                      <tr key={i} className="border-b border-[#3f3f3f]/50 hover:bg-[#3a3a3a]/50">
                        <td className="p-3 text-[#f5f5f5]">{row.Brand || row.Category || row.AgeBracket}</td>
                        <td className="p-3 text-right text-[#f5f5f5]">{row.SKUCount.toLocaleString()}</td>
                        <td className="p-3 text-right text-[#f5f5f5]">{formatCurrency(row.TotalValue)}</td>
                        <td className="p-3 text-right text-[#f5f5f5]">{row.TotalUnits.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-[#2a2a2a] border border-[#3f3f3f] rounded-xl overflow-hidden">
              <div className="p-4 border-b border-[#3f3f3f] flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#f5f5f5]">All Dead Stock ({list.length.toLocaleString()} items)</h2>
                <button onClick={exportCSV} disabled={loading || list.length === 0} className="px-4 py-2 bg-[#f5c518] text-[#1a1a1a] font-semibold rounded-lg hover:bg-[#fcd34d] disabled:opacity-50 transition-all duration-200 text-sm">Export Full List CSV</button>
              </div>
              <div className="overflow-x-auto" style=241>
                <table className="w-full">
                  <thead className="sticky top-0 bg-[#2a2a2a]">
                    <tr className="border-b border-[#3f3f3f]">
                      <th className="p-4 text-left cursor-pointer hover:bg-[#3a3a3a] transition text-[#a78bfa] font-medium text-sm uppercase tracking-wider" onClick={() => handleSort('SKU')}>SKU <SortIcon column="SKU" /></th>
                      <th className="p-4 text-left cursor-pointer hover:bg-[#3a3a3a] transition text-[#a78bfa] font-medium text-sm uppercase tracking-wider" onClick={() => handleSort('Title')}>Title <SortIcon column="Title" /></th>
                      <th className="p-4 text-left cursor-pointer hover:bg-[#3a3a3a] transition text-[#a78bfa] font-medium text-sm uppercase tracking-wider" onClick={() => handleSort('Brand')}>Brand <SortIcon column="Brand" /></th>
                      <th className="p-4 text-left cursor-pointer hover:bg-[#3a3a3a] transition text-[#a78bfa] font-medium text-sm uppercase tracking-wider" onClick={() => handleSort('Category')}>Category <SortIcon column="Category" /></th>
                      <th className="p-4 text-right cursor-pointer hover:bg-[#3a3a3a] transition text-[#a78bfa] font-medium text-sm uppercase tracking-wider" onClick={() => handleSort('Stock')}>Stock <SortIcon column="Stock" /></th>
                      <th className="p-4 text-right cursor-pointer hover:bg-[#3a3a3a] transition text-[#a78bfa] font-medium text-sm uppercase tracking-wider" onClick={() => handleSort('StockValue')}>Value <SortIcon column="StockValue" /></th>
                      <th className="p-4 text-right cursor-pointer hover:bg-[#3a3a3a] transition text-[#a78bfa] font-medium text-sm uppercase tracking-wider" onClick={() => handleSort('DaysSinceSale')}>Days <SortIcon column="DaysSinceSale" /></th>
                      <th className="p-4 text-left text-[#a78bfa] font-medium text-sm uppercase tracking-wider">Age</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedList.map((row, i) => (
                      <tr key={i} className="border-b border-[#3f3f3f]/50 hover:bg-[#3a3a3a]/50 transition-colors duration-150">
                        <td className="p-4 font-mono text-sm text-[#f5f5f5]">{row.SKU}</td>
                        <td className="p-4 text-[#f5f5f5] max-w-xs truncate">{row.Title}</td>
                        <td className="p-4 text-[#9ca3af]">{row.Brand}</td>
                        <td className="p-4 text-[#9ca3af] max-w-xs truncate">{row.Category}</td>
                        <td className="p-4 text-right text-[#f5f5f5]">{row.Stock}</td>
                        <td className="p-4 text-right text-[#f5f5f5]">{formatCurrency(row.StockValue)}</td>
                        <td className="p-4 text-right text-[#f5f5f5]">{row.DaysSinceSale?.toLocaleString() || '—'}</td>
                        <td className="p-4 text-[#9ca3af]">{row.AgeBracket}</td>
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
