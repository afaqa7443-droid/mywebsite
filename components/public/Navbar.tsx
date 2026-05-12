import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-brand-600">
          PhoneMarket
        </Link>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-600 hover:text-brand-700"
          >
            WhatsApp
          </a>
          <Link
            href="/admin/login"
            className="rounded-md bg-gray-100 px-3 py-1.5 text-gray-700 hover:bg-gray-200"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
