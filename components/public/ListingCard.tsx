import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import type { Listing, ListingMedia } from '@/types';

interface Props {
  listing: Listing;
  media: ListingMedia[];
}

export default function ListingCard({ listing, media }: Props) {
  const thumbnail = media.find((m) => m.type === 'image');

  return (
    <Link
      href={`/listings/${listing.slug}`}
      className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:shadow-gray-900"
    >
      <div className="aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
        {thumbnail ? (
          <img
            src={thumbnail.url}
            alt={listing.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400 dark:text-gray-500">
            No image
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {listing.brand}
        </p>
        <p className="mt-0.5 font-semibold text-gray-900 dark:text-gray-100">{listing.title}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {formatPrice(listing.price)}
          </span>
          {listing.quantity > 0 && (
            <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-400">
              {listing.quantity} in stock
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
