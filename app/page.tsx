import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] p-8 font-sans">
      <div className="max-w-2xl mx-auto pt-12">
        <h1 className="text-4xl font-bold text-[#f5c518] mb-2">GSS Reports</h1>
        <p className="text-[#9ca3af] mb-10">Internal reporting tools for GSS Auto Parts.</p>
        
        <div className="space-y-4">
          <Link href="/dead-stock" className="block bg-[#2a2a2a] border border-[#3f3f3f] rounded-xl p-5 hover:border-[#f5c518] hover:bg-[#3a3a3a] transition-all duration-200 group border-l-4 border-l-[#f5c518]">
            <h2 className="text-lg font-semibold text-[#f5c518] group-hover:text-[#fcd34d] transition-colors">Dead Stock Dashboard</h2>
            <p className="text-[#9ca3af] text-sm mt-1">Analysis of dead stock by brand, category, and age. Identify items to liquidate.</p>
          </Link>

          <Link href="/overstocked" className="block bg-[#2a2a2a] border border-[#3f3f3f] rounded-xl p-5 hover:border-[#f5c518] hover:bg-[#3a3a3a] transition-all duration-200 group border-l-4 border-l-orange-500">
            <h2 className="text-lg font-semibold text-orange-400 group-hover:text-orange-300 transition-colors">Overstocked Items Dashboard</h2>
            <p className="text-[#9ca3af] text-sm mt-1">Items exceeding maximum stock levels. Identify excess inventory to reduce.</p>
          </Link>

          <Link href="/brand-stock" className="block bg-[#2a2a2a] border border-[#3f3f3f] rounded-xl p-5 hover:border-[#a78bfa] hover:bg-[#3a3a3a] transition-all duration-200 group">
            <h2 className="text-lg font-semibold text-[#f5f5f5] group-hover:text-[#f5c518] transition-colors">Brand Stock Report</h2>
            <p className="text-[#9ca3af] text-sm mt-1">SKU counts and stock on hand by brand and supplier.</p>
          </Link>

          <Link href="/no-category" className="block bg-[#2a2a2a] border border-[#3f3f3f] rounded-xl p-5 hover:border-[#a78bfa] hover:bg-[#3a3a3a] transition-all duration-200 group">
            <h2 className="text-lg font-semibold text-[#f5f5f5] group-hover:text-[#f5c518] transition-colors">Products With Stock - No Category</h2>
            <p className="text-[#9ca3af] text-sm mt-1">Products with stock that need categorisation.</p>
          </Link>

          <Link href="/tba-brand" className="block bg-[#2a2a2a] border border-[#3f3f3f] rounded-xl p-5 hover:border-[#a78bfa] hover:bg-[#3a3a3a] transition-all duration-200 group">
            <h2 className="text-lg font-semibold text-[#f5f5f5] group-hover:text-[#f5c518] transition-colors">Products With Stock - TBA Brand</h2>
            <p className="text-[#9ca3af] text-sm mt-1">Products with stock that need brand assignment.</p>
          </Link>

          <Link href="/no-package" className="block bg-[#2a2a2a] border border-[#3f3f3f] rounded-xl p-5 hover:border-[#a78bfa] hover:bg-[#3a3a3a] transition-all duration-200 group">
            <h2 className="text-lg font-semibold text-[#f5f5f5] group-hover:text-[#f5c518] transition-colors">Products With Stock - No Package</h2>
            <p className="text-[#9ca3af] text-sm mt-1">Products with stock that need package type assignment.</p>
          </Link>

          <Link href="/gpt-no-package" className="block bg-[#2a2a2a] border border-[#3f3f3f] rounded-xl p-5 hover:border-[#a78bfa] hover:bg-[#3a3a3a] transition-all duration-200 group">
            <h2 className="text-lg font-semibold text-[#f5f5f5] group-hover:text-[#f5c518] transition-colors">Products with GPT Done - No Package</h2>
            <p className="text-[#9ca3af] text-sm mt-1">GPT-processed products still missing package type.</p>
          </Link>

          <Link href="/gpt-no-category" className="block bg-[#2a2a2a] border border-[#3f3f3f] rounded-xl p-5 hover:border-[#a78bfa] hover:bg-[#3a3a3a] transition-all duration-200 group">
            <h2 className="text-lg font-semibold text-[#f5f5f5] group-hover:text-[#f5c518] transition-colors">Products with GPT Done - No Category</h2>
            <p className="text-[#9ca3af] text-sm mt-1">GPT-processed products still missing category.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
