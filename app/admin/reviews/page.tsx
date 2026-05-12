'use client';

import { useEffect, useState } from 'react';
import ReviewForm from '@/components/admin/ReviewForm';
import type { Listing, Review, ReviewMedia } from '@/types';

export default function AdminReviewsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const [reviews, setReviews] = useState<(Review & { media: ReviewMedia[] })[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);

  useEffect(() => {
    fetch('/api/listings')
      .then((r) => r.json())
      .then(setListings);
  }, []);

  async function loadReviews(listingId: string) {
    const res = await fetch(`/api/reviews?listing_id=${listingId}`);
    const data = await res.json();
    setReviews(data);
  }

  function selectListing(id: string) {
    setSelectedListing(id);
    setShowForm(false);
    setEditingReview(null);
    loadReviews(id);
  }

  function handleDone() {
    setShowForm(false);
    setEditingReview(null);
    if (selectedListing) loadReviews(selectedListing);
  }

  async function handleDelete(reviewId: string) {
    if (!confirm('Delete this review?')) return;
    await fetch(`/api/reviews/${reviewId}`, { method: 'DELETE' });
    if (selectedListing) loadReviews(selectedListing);
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Reviews</h1>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Select Listing
        </label>
        <select
          value={selectedListing ?? ''}
          onChange={(e) => selectListing(e.target.value)}
          className="w-full max-w-sm rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Choose a listing...</option>
          {listings.map((l) => (
            <option key={l.id} value={l.id}>
              {l.title}
            </option>
          ))}
        </select>
      </div>

      {selectedListing && (
        <>
          <button
            onClick={() => {
              setEditingReview(null);
              setShowForm(!showForm);
            }}
            className="mb-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            {showForm ? 'Cancel' : '+ Add Review'}
          </button>

          {showForm && (
            <ReviewForm
              listingId={selectedListing}
              review={editingReview}
              onDone={handleDone}
            />
          )}

          <div className="mt-4 space-y-3">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-xl border border-gray-200 p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">
                      {review.reviewer === '*' ? 'Anonymous' : review.reviewer}
                    </span>
                    <span className="ml-2 text-amber-500">
                      {'★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingReview(review);
                        setShowForm(true);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {review.text && (
                  <p className="mt-2 text-sm text-gray-600">{review.text}</p>
                )}
              </div>
            ))}
            {reviews.length === 0 && !showForm && (
              <p className="text-sm text-gray-400">No reviews for this listing.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
