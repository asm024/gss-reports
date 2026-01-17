import Link from 'next/link';

export default function Home() {
  return (
    <div className="p-8 font-sans">
      <h1 className="text-2xl font-bold mb-4">GSS Reports</h1>
      <ul>
        <li>
          <Link href="/brand-stock" className="text-blue-500 hover:underline">
            Brand Stock Report
          </Link>
        </li>
      </ul>
    </div>
  );
}
