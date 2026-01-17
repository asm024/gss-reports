import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] p-8 font-sans">
      <div className="max-w-2xl mx-auto pt-12">
        <h1 className="text-4xl font-bold text-[#f5c518] mb-2">GSS Reports</h1>
        <p className="text-[#9ca3af] mb-10">Internal reporting tools for GSS Auto Parts.</p>
        
        <div className="space-y-4">
          <Link 
            href="/brand-stock" 
            className="block bg-[#2a2a2a] border border-[#3f3f3f] rounded-xl p-5 hover:border-[#a78bfa] hover:bg-[#3a3a3a] transition-all duration-200 group"
          >
            <h2 className="text-lg font-semibold text-[#f5f5f5] group-hover:text-[#f5c518] transition-colors">
              Brand Stock Report
            </h2>
            <p className="text-[#9ca3af] text-sm mt-1">
              SKU counts and stock on hand by brand and supplier.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
