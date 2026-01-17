'use client';

import { useState, useEffect } from 'react';

interface BrandRow {
  ID: number;
  Scraped_Supplier: string;
  Scraped_Brand: string;
  SKU_Count: number;
  Total_QOH: number;
}

export default function BrandStockReport() {
  const [data, setData] = useState<BrandRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <div className="p-8 font-sans">
      <h1 className="text-2xl font-bold mb-4">Brand Stock Report</h1>
      <button 
        onClick={fetchData} 
        disabled={loading}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Loading...' : 'Refresh'}
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Brand</th>
              <th className="border border-gray-300 p-2 text-left">Supplier</th>
              <th className="border border-gray-300 p-2 text-right">SKU Count</th>
              <th className="border border-gray-300 p-2 text-right">Total QOH</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{row.Scraped_Brand}</td>
                <td className="border border-gray-300 p-2">{row.Scraped_Supplier}</td>
                <td className="border border-gray-300 p-2 text-right">{row.SKU_Count}</td>
                <td className="border border-gray-300 p-2 text-right">{row.Total_QOH}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
