'use client';

import { useState } from 'react';
import MediaUploader from './MediaUploader';
import type { Review, ReviewMedia } from '@/types';

interface Props {
  review?: Review & { media?: ReviewMedia[] };
  listingId: string;
  onDone: () => void;
}

export default function ReviewForm({ review, listingId, onDone }: Props) {
  const isEdit = !!review;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [reviewer, setReviewer] = useState(review?.reviewer ?? '');
  const [rating, setRating] = useState(review?.rating ?? 5);
  const [text, setText] = useState(review?.text ?? '');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const url = isEdit ? `/api/reviews/${review.id}` : '/api/reviews';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listingId,
          reviewer,
          rating,
          text,
        }),
      });

      if (!res.ok) throw new Error('Failed to save review');

      onDone();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gray-200 p-4">
      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Reviewer Name
          </label>
          <input
            type="text"
            value={reviewer}
            onChange={(e) => setReviewer(e.target.value)}
            required
            placeholder="Rahul S. (or * for anonymous)"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Rating
          </label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {'★'.repeat(n) + '☆'.repeat(5 - n)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Review Text
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Media (optional)
        </label>
        <MediaUploader
          bucket="review-media"
          accept="image/*,video/*"
          onUpload={(url) => setMediaUrls((prev) => [...prev, url])}
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : isEdit ? 'Update Review' : 'Add Review'}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
