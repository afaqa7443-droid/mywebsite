import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="flex w-60 flex-col border-r border-gray-200 bg-gray-50 p-4">
        <Link
          href="/admin"
          className="mb-6 text-lg font-bold text-brand-600"
        >
          Admin
        </Link>
        <nav className="flex flex-col gap-2 text-sm">
          <Link
            href="/admin"
            className="rounded-md px-3 py-2 text-gray-700 hover:bg-gray-200"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/new"
            className="rounded-md px-3 py-2 text-gray-700 hover:bg-gray-200"
          >
            New Listing
          </Link>
          <Link
            href="/admin/reviews"
            className="rounded-md px-3 py-2 text-gray-700 hover:bg-gray-200"
          >
            Reviews
          </Link>
          <a
            href="/"
            className="mt-6 rounded-md px-3 py-2 text-gray-400 hover:bg-gray-200"
          >
            &larr; View Site
          </a>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
