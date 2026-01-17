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

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/brand-stock');
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setData(json);
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
    if (sortKey !== column) return <span className="text-gray-300 ml-1">↕</span>;
    return <span className="ml-1">{sortAsc ? '↑' : '↓'}</span>;
  };

  return (
    <div className="p-8 font-sans">
      <h1 className="text-2xl font-bold mb-4">Brand Stock Report</h1>
      
      <div className="mb-4 flex gap-2">
        <button 
          onClick={fetchData} 
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
        
        <button 
          onClick={exportCSV}
          disabled={loading || data.length === 0}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          Export CSV
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <p className="mb-2 text-gray-600">{data.length} brands</p>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th 
                  className="border border-gray-300 p-2 text-left cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort('Scraped_Brand')}
                >
                  Brand <SortIcon column="Scraped_Brand" />
                </th>
                <th 
                  className="border border-gray-300 p-2 text-left cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort('Scraped_Supplier')}
                >
                  Supplier <SortIcon column="Scraped_Supplier" />
                </th>
                <th 
                  className="border border-gray-300 p-2 text-right cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort('SKU_Count')}
                >
                  SKU Count <SortIcon column="SKU_Count" />
                </th>
                <th 
                  className="border border-gray-300 p-2 text-right cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort('Total_QOH')}
                >
                  Total QOH <SortIcon column="Total_QOH" />
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2">{row.Scraped_Brand}</td>
                  <td className="border border-gray-300 p-2">{row.Scraped_Supplier}</td>
                  <td className="border border-gray-300 p-2 text-right">{row.SKU_Count.toLocaleString()}</td>
                  <td className="border border-gray-300 p-2 text-right">{row.Total_QOH.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
