'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DataTable from '@/components/admin/DataTable';
import type { Listing } from '@/types';

export default function AdminDashboard() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadListings() {
    const res = await fetch('/api/listings');
    const data = await res.json();
    setListings(data);
    setLoading(false);
  }

  useEffect(() => {
    loadListings();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('Delete this listing permanently?')) return;
    await fetch(`/api/listings/${id}`, { method: 'DELETE' });
    loadListings();
  }

  if (loading) {
    return <p className="text-gray-400">Loading...</p>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link
          href="/admin/new"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          + New Listing
        </Link>
      </div>
      <DataTable listings={listings} onDelete={handleDelete} />
    </div>
  );
}
