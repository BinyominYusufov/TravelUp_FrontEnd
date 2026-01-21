import { useState, useEffect } from 'react';
import { Star, Loader2, Edit2, Trash2, MessageSquare, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { reviewsApi, bookingsApi, type Review, type Booking } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface ReviewsSectionProps {
  destinationId: string;
}

export const ReviewsSection = ({ destinationId }: ReviewsSectionProps) => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [hasConfirmedBooking, setHasConfirmedBooking] = useState<boolean | null>(null);
  const [isCheckingBooking, setIsCheckingBooking] = useState(true);
  
  // Review form state
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState<string | null>(null);
  
  // Edit/Delete state
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Check if user has confirmed booking for this destination
  useEffect(() => {
    const checkConfirmedBooking = async () => {
      if (!isAuthenticated || !user) {
        setHasConfirmedBooking(false);
        setIsCheckingBooking(false);
        return;
      }

      try {
        const bookings = await bookingsApi.getMyBookings();
        const confirmedBooking = bookings.find(
          (booking) => booking.destination_id === destinationId && booking.status === 'confirmed'
        );
        setHasConfirmedBooking(!!confirmedBooking);
      } catch (error) {
        // If we can't check bookings, assume no confirmed booking
        setHasConfirmedBooking(false);
      } finally {
        setIsCheckingBooking(false);
      }
    };

    checkConfirmedBooking();
  }, [destinationId, isAuthenticated, user]);

  // Load reviews
  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await reviewsApi.getForDestination(destinationId);
        setReviews(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load reviews. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingReviews(false);
      }
    };

    loadReviews();
  }, [destinationId, toast]);

  const handleOpenReviewForm = () => {
    if (!hasConfirmedBooking) {
      toast({
        title: 'Cannot leave review',
        description: 'You can leave a review only after your booking is confirmed.',
        variant: 'destructive',
      });
      return;
    }
    setReviewError(null);
    setRating(5);
    setComment('');
    setEditingReview(null);
    setIsReviewFormOpen(true);
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setRating(review.rating);
    setComment(review.comment || '');
    setReviewError(null);
    setIsReviewFormOpen(true);
  };

  const handleSubmitReview = async () => {
    setReviewError(null);

    if (rating < 1 || rating > 5) {
      setReviewError('Please select a rating between 1 and 5 stars.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingReview) {
        // Update existing review
        const updatedReview = await reviewsApi.update(editingReview.id, {
          rating,
          comment: comment.trim() || null,
        });
        setReviews((prev) =>
          prev.map((r) => (r.id === updatedReview.id ? updatedReview : r))
        );
        toast({
          title: 'Review updated',
          description: 'Your review has been updated successfully.',
        });
      } else {
        // Create new review
        const newReview = await reviewsApi.create({
          destination_id: destinationId,
          rating,
          comment: comment.trim() || null,
        });
        setReviews((prev) => [newReview, ...prev]);
        toast({
          title: 'Review submitted',
          description: 'Thank you for your review!',
        });
      }

      setIsReviewFormOpen(false);
      setRating(5);
      setComment('');
      setEditingReview(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit review. Please try again.';
      
      // Handle 403 Forbidden specifically
      if (errorMessage.toLowerCase().includes('forbidden') || errorMessage.includes('403')) {
        const forbiddenMessage = 'Only users with confirmed bookings can leave reviews.';
        setReviewError(forbiddenMessage);
        toast({
          title: 'Cannot leave review',
          description: forbiddenMessage,
          variant: 'destructive',
        });
      } else {
        setReviewError(errorMessage);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    setIsDeleting(reviewId);

    try {
      await reviewsApi.delete(reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      toast({
        title: 'Review deleted',
        description: 'Your review has been deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete review. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const renderStars = (ratingValue: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            disabled={!interactive}
            className={`
              ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
              ${star <= ratingValue ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
            `}
          >
            <Star className="w-5 h-5" />
          </button>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Reviews ({reviews.length})
          </CardTitle>
          {isAuthenticated && (
            <Button
              onClick={handleOpenReviewForm}
              disabled={isCheckingBooking || !hasConfirmedBooking}
              variant="outline"
              size="sm"
            >
              Write a Review
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Show message if user doesn't have confirmed booking */}
        {isAuthenticated && !isCheckingBooking && !hasConfirmedBooking && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You can leave a review only after your booking is confirmed.
            </AlertDescription>
          </Alert>
        )}

        {/* Reviews List */}
        {isLoadingReviews ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No reviews yet. Be the first to review this destination!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => {
              const isOwner = user && review.user_id === user.id;
              return (
                <div key={review.id} className="border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {renderStars(review.rating)}
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-foreground mt-2 whitespace-pre-wrap">
                          {review.comment}
                        </p>
                      )}
                    </div>
                    {isOwner && (
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditReview(review)}
                          disabled={isDeleting === review.id}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteReview(review.id)}
                          disabled={isDeleting === review.id}
                        >
                          {isDeleting === review.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Review Form Dialog */}
        <Dialog open={isReviewFormOpen} onOpenChange={setIsReviewFormOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingReview ? 'Edit Review' : 'Write a Review'}
              </DialogTitle>
              <DialogDescription>
                {editingReview
                  ? 'Update your review for this destination.'
                  : 'Share your experience with other travelers.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Rating</Label>
                {renderStars(rating, true, setRating)}
              </div>
              <div className="space-y-2">
                <Label htmlFor="comment">Comment (optional)</Label>
                <Textarea
                  id="comment"
                  placeholder="Share your experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                />
              </div>
              {reviewError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{reviewError}</AlertDescription>
                </Alert>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsReviewFormOpen(false);
                  setReviewError(null);
                  setEditingReview(null);
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmitReview} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {editingReview ? 'Updating...' : 'Submitting...'}
                  </>
                ) : (
                  editingReview ? 'Update Review' : 'Submit Review'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
