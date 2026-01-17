import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-[#f5c518]">GSS Reports</h1>
      <ul className="space-y-3">
        <li>
          <Link 
            href="/brand-stock" 
            className="inline-flex items-center gap-2 text-[#a78bfa] hover:text-[#c4b5fd] transition-colors"
          >
            <span>→</span> Brand Stock Report
          </Link>
        </li>
      </ul>
    </div>
  );
}
