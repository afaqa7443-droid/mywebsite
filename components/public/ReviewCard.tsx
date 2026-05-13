import { ratingStars, timeAgo } from '@/lib/utils';
import type { Review, ReviewMedia } from '@/types';

interface Props {
  review: Review & { media: ReviewMedia[] };
}

export default function ReviewCard({ review }: Props) {
  return (
    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {review.reviewer === '*' ? 'Anonymous' : review.reviewer}
          </span>
          <span className="text-amber-500">{ratingStars(review.rating)}</span>
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500">{timeAgo(review.created_at)}</span>
      </div>
      {review.text && (
        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {review.text}
        </p>
      )}
      {review.media.length > 0 && (
        <div className="mt-2 flex gap-2">
          {review.media.map((m) => (
            <div
              key={m.id}
              className="h-12 w-16 overflow-hidden rounded-md bg-gray-200 dark:bg-gray-700"
            >
              {m.type === 'image' ? (
                <img src={m.url} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center bg-gray-800 text-white text-xs dark:bg-gray-700">
                  ▶
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
