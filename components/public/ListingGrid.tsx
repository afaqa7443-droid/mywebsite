import type { Listing, ListingMedia } from '@/types';
import ListingCard from './ListingCard';

interface Props {
  listings: (Listing & { media: ListingMedia[] })[];
}

export default function ListingGrid({ listings }: Props) {
  if (listings.length === 0) {
    return (
      <div className="py-20 text-center text-gray-500 dark:text-gray-400">
        No listings available yet. Check back soon!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} media={listing.media} />
      ))}
    </div>
  );
}
