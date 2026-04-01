import { Star } from 'lucide-react';
import { getReviewsForListing, getReviewSummary } from '../../data/seedReviews';

interface Props {
  listingId: string;
}

function StarRating({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={n <= Math.round(rating) ? 'text-gold' : 'text-dark/15'}
          fill={n <= Math.round(rating) ? 'currentColor' : 'none'}
        />
      ))}
    </span>
  );
}

function CategoryBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-dark/60 w-28 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-dark/8 overflow-hidden">
        <div
          className="h-full rounded-full bg-gold transition-all"
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-dark/70 w-6 text-right">{value.toFixed(1)}</span>
    </div>
  );
}

function formatReviewDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

export default function ReviewSection({ listingId }: Props) {
  const reviews = getReviewsForListing(listingId);
  const summary = getReviewSummary(listingId);

  if (!summary || reviews.length === 0) {
    return (
      <div className="rounded-2xl border border-dark/8 bg-white px-4 py-6 text-center">
        <p className="text-sm text-dark/40">No reviews yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-dark/8 bg-white overflow-hidden">
      {/* Summary header */}
      <div className="px-4 py-4 border-b border-dark/5">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl font-extrabold text-dark">{summary.averageRating.toFixed(1)}</span>
          <div>
            <StarRating rating={summary.averageRating} size={15} />
            <p className="text-xs text-dark/50 mt-0.5">{summary.count} review{summary.count !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="space-y-2">
          <CategoryBar label="Accuracy" value={summary.accuracy} />
          <CategoryBar label="Communication" value={summary.communication} />
          <CategoryBar label="Cleanliness" value={summary.cleanliness} />
          <CategoryBar label="Value" value={summary.value} />
        </div>
      </div>

      {/* Individual reviews */}
      <div className="divide-y divide-dark/5">
        {reviews.map((review) => (
          <div key={review.id} className="px-4 py-4 bg-cream/30">
            <div className="flex items-center gap-2.5 mb-2">
              {review.reviewerProfilePic ? (
                <img
                  src={review.reviewerProfilePic}
                  alt={review.reviewerName}
                  className="w-8 h-8 rounded-full object-cover border border-dark/10"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-dark/10" />
              )}
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold text-dark">{review.reviewerName}</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <StarRating rating={review.rating} size={11} />
                  <span className="text-[10px] text-dark/40">{formatReviewDate(review.createdAt)}</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-dark/70 leading-relaxed">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
