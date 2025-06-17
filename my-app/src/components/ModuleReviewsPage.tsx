import React, { useEffect, useState } from 'react';
import ReviewForm from './ReviewForm';
import ReviewThread from './ReviewThread';
import { getReviews, postReview, postReply } from './api';

interface ModuleReviewsPageProps {
  moduleCode: string;
}

const ModuleReviewsPage: React.FC<ModuleReviewsPageProps> = ({ moduleCode }) => {
  const [reviews, setReviews] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await getReviews(moduleCode);
        setReviews(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load reviews');
        setLoading(false);
      }
    };

    fetchReviews();
  }, [moduleCode]);

  const handleReviewSubmit = async (content: string, rating: number) => {
    try {
      const author = "current_user";
      await postReview(moduleCode, author, content, rating);
      const data = await getReviews(moduleCode);
      setReviews(data);
    } catch (err) {
      setError('Failed to post review');
    }
  };

  const handleReplySubmit = async (reviewId: string, content: string) => {
    try {
      const author = "current_user";
      await postReply(moduleCode, reviewId, author, content);
      const data = await getReviews(moduleCode);
      setReviews(data);
    } catch (err) {
      setError('Failed to post reply');
    }
  };

  if (loading) return (
    <div className="loading-state">
      <p>Loading reviews...</p>
    </div>
  );

  if (error) return (
    <div className="error-state">
      <p>Error: {error}</p>
      <button onClick={() => window.location.reload()}>Try Again</button>
    </div>
  );

  return (
    <div className="module-reviews-page">
      <h2>Reviews for {moduleCode}</h2>
      
      <ReviewForm moduleCode={moduleCode} onSubmit={handleReviewSubmit} />
      
      <div className="reviews-list">
        {Object.values(reviews).length === 0 ? (
          <div className="no-reviews">
            <p>No reviews yet. Be the first to post one!</p>
          </div>
        ) : (
          Object.values(reviews).map((review) => (
            <ReviewThread
              key={review.id}
              review={review}
              moduleCode={moduleCode}
              onReplySubmit={handleReplySubmit}
              setReviews={setReviews}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ModuleReviewsPage;