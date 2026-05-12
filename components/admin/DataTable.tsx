import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import type { Listing } from '@/types';

interface Props {
  listings: Listing[];
  onDelete: (id: string) => void;
}

export default function DataTable({ listings, onDelete }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 font-medium text-gray-600">Title</th>
            <th className="px-4 py-3 font-medium text-gray-600">Brand</th>
            <th className="px-4 py-3 font-medium text-gray-600">Price</th>
            <th className="px-4 py-3 font-medium text-gray-600">Stock</th>
            <th className="px-4 py-3 font-medium text-gray-600">Condition</th>
            <th className="px-4 py-3 font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing) => (
            <tr key={listing.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">
                {listing.title}
              </td>
              <td className="px-4 py-3 text-gray-600">{listing.brand}</td>
              <td className="px-4 py-3 text-gray-900">
                {formatPrice(listing.price)}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    listing.quantity > 0
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {listing.quantity}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600">{listing.condition}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Link
                    href={`/admin/${listing.id}/edit`}
                    className="rounded-md bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => onDelete(listing.id)}
                    className="rounded-md bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
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
        <p className="p-8 text-center text-gray-400">No listings yet.</p>
      )}
    </div>
  );
}
