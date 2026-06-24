'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { ProductDetailSkeleton } from '@/components/Skeleton';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  healthiness?: number;
  priceHonestyRating?: number;
}

interface Review {
  _id: string;
  userId: string;
  userEmail: string;
  userName: string;
  productId: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [priceHonesty, setPriceHonesty] = useState<number | null>(null);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${id}`);
      const data = await res.json();
      if (res.ok) setReviews(data.reviews || []);
    } catch {}
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [productRes, reviewsRes, authRes] = await Promise.all([
          fetch(`/api/products/${id}`),
          fetch(`/api/reviews?productId=${id}`),
          fetch('/api/auth/me'),
        ]);

        if (!productRes.ok) {
          setError(true);
        } else {
          const productData = await productRes.json();
          setProduct(productData);
        }

        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          setReviews(reviewsData.reviews || []);
        }

        if (authRes.ok) {
          const authData = await authRes.json();
          if (authData?.authenticated) setUser(authData.user);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  useEffect(() => {
    if (!product) return;

    const nextValue = (() => {
      const stored = localStorage.getItem(`priceHonesty:${product.id}`);
      if (stored) return Number(stored);
      return typeof product.priceHonestyRating === 'number' ? product.priceHonestyRating : null;
    })();

    const handle = requestAnimationFrame(() => setPriceHonesty(nextValue));

    return () => cancelAnimationFrame(handle);
  }, [product]);

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
        <div className="mb-8">
          <div className="h-5 w-32 animate-pulse rounded-md bg-slate-200" />
        </div>
        <ProductDetailSkeleton />
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Product not found</h1>
          <Link href="/products" className="text-green-600 hover:text-green-700 font-medium">
            ← Back to Products
          </Link>
        </div>
      </main>
    );
  }

  const handleAddToCart = () => {
    addItem(product);
  };

  const submitPriceHonesty = (value: number) => {
    if (!product) return;
    localStorage.setItem(`priceHonesty:${product.id}`, String(value));
    setPriceHonesty(value);
  };

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
      <div className="mb-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-green-600 hover:text-green-700 font-medium transition-colors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Products
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-2 animate-fade-in">
        <div className="aspect-square relative overflow-hidden rounded-xl">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>

        <div className="space-y-6">
          <div>
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-green-600 bg-green-50 px-2.5 py-1 rounded-full mb-3">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{product.name}</h1>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">{Math.round(product.price)} Tk</p>
            {typeof product.healthiness === 'number' && (
              <p className="text-sm text-slate-500 mt-1">Healthiness: {product.healthiness}%</p>
            )}
            <div className="mt-3 flex items-center gap-3">
              <div className="text-sm text-slate-600">Price honesty:</div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => submitPriceHonesty(s)}
                    className={`p-0.5 ${priceHonesty && s <= priceHonesty ? 'text-yellow-400' : 'text-slate-200'}`}
                    aria-label={`Rate price honesty ${s}`}
                  >
                    <svg className="size-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
              {priceHonesty && <span className="text-sm text-slate-500">({priceHonesty} / 5)</span>}
            </div>
            {averageRating && (
              <div className="flex items-center gap-1.5 mt-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`size-4 ${star <= Math.round(parseFloat(averageRating)) ? 'text-yellow-400' : 'text-slate-200'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-slate-500">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">Description</h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{product.description}</p>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm active:scale-[0.98]"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add to Cart
          </button>
        </div>
      </div>

      <div className="mt-12 border-t border-slate-200 pt-10">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Customer Reviews</h2>

        {user && <ReviewForm productId={product.id} onReviewAdded={fetchReviews} />}

        {reviews.length === 0 ? (
          <p className="text-sm text-slate-500 py-8 text-center">No reviews yet. Be the first to review this product!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-full bg-green-100 flex items-center justify-center text-xs font-bold text-green-700">
                      {(review.userName || review.userEmail).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{review.userName || review.userEmail.split('@')[0]}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`size-4 ${star <= review.rating ? 'text-yellow-400' : 'text-slate-200'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-sm text-slate-600 leading-relaxed mt-2">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function ReviewForm({ productId, onReviewAdded }: { productId: number; onReviewAdded: () => void }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setMessage({ type: 'error', text: 'Please select a rating' });
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Failed to submit review' });
        return;
      }
      setMessage({ type: 'success', text: 'Review submitted!' });
      setRating(0);
      setComment('');
      onReviewAdded();
    } catch {
      setMessage({ type: 'error', text: 'Failed to connect' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-5 mb-6">
      <h3 className="text-sm font-semibold text-slate-900 mb-3">Write a Review</h3>
      <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="p-0.5"
          >
            <svg
              className={`size-6 transition-colors ${
                star <= (hover || rating) ? 'text-yellow-400' : 'text-slate-200'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
      <textarea
        rows={2}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your thoughts about this product (optional)"
        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 resize-none mb-3"
      />
      {message && (
        <div
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm mb-3 ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
