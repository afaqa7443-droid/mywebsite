import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import type { Listing } from '@/types';

interface Props {
  listings: Listing[];
  onDelete: (id: string) => void;
}

export default function DataTable({ listings, onDelete }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
            <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Title</th>
            <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Brand</th>
            <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Price</th>
            <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Stock</th>
            <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Condition</th>
            <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing) => (
            <tr key={listing.id} className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
              <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                {listing.title}
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{listing.brand}</td>
              <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                {formatPrice(listing.price)}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    listing.quantity > 0
                      ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400'
                      : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400'
                  }`}
                >
                  {listing.quantity}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{listing.condition}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Link
                    href={`/admin/${listing.id}/edit`}
                    className="rounded-md bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-400 dark:hover:bg-blue-900"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => onDelete(listing.id)}
                    className="rounded-md bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {listings.length === 0 && (
        <p className="p-8 text-center text-gray-400 dark:text-gray-500">No listings yet.</p>
      )}
    </div>
  );
}
