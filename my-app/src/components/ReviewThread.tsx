import React, { useState } from 'react';
import ReplyForm from './ReplyForm';
import Rating from './Rating';
import { upvoteReview, upvoteReply } from './api';

interface Reply {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  upvotes: number;
}

interface Review {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  rating: number;
  upvotes: number;
  replies: Record<string, Reply>;
}

interface ReviewThreadProps {
  review: Review;
  moduleCode: string;
  onReplySubmit: (reviewId: string, content: string) => void;
  setReviews: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

const ReviewThread: React.FC<ReviewThreadProps> = ({ 
  review, 
  moduleCode, 
  onReplySubmit,
  setReviews
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [upvotedReviews, setUpvotedReviews] = useState<Record<string, boolean>>({});
  const [upvotedReplies, setUpvotedReplies] = useState<Record<string, boolean>>({});

  const handleReplySubmit = (content: string) => {
    onReplySubmit(review.id, content);
    setShowReplyForm(false);
  };

  const handleReviewUpvote = async () => {
    if (upvotedReviews[review.id]) return;
    
    try {
      const result = await upvoteReview(moduleCode, review.id);
      setReviews(prev => ({
        ...prev,
        [review.id]: {
          ...prev[review.id],
          upvotes: result.new_count
        }
      }));
      setUpvotedReviews(prev => ({ ...prev, [review.id]: true }));
    } catch (err) {
      console.error("Failed to upvote review:", err);
    }
  };

  const handleReplyUpvote = async (replyId: string) => {
    if (upvotedReplies[replyId]) return;
    
    try {
      const result = await upvoteReply(moduleCode, review.id, replyId);
      setReviews(prev => ({
        ...prev,
        [review.id]: {
          ...prev[review.id],
          replies: {
            ...prev[review.id].replies,
            [replyId]: {
              ...prev[review.id].replies[replyId],
              upvotes: result.new_count
            }
          }
        }
      }));
      setUpvotedReplies(prev => ({ ...prev, [replyId]: true }));
    } catch (err) {
      console.error("Failed to upvote reply:", err);
    }
  };

  return (
    <div className="review-thread">
      <div className="review">
        <div className="review-header">
          <span className="author">{review.author}</span>
          <Rating rating={review.rating} />
          <span className="timestamp text-muted">
            {new Date(review.timestamp).toLocaleString()}
          </span>
        </div>
        <div className="review-content">{review.content}</div>
        <div className="review-actions">
          <button 
            onClick={handleReviewUpvote}
            className={upvotedReviews[review.id] ? "upvoted" : ""}
            disabled={upvotedReviews[review.id]}
          >
            {upvotedReviews[review.id] ? "Upvoted" : "Upvote"} ({review.upvotes})
          </button>
          <button 
            onClick={() => setShowReplyForm(!showReplyForm)}
            className={showReplyForm ? "secondary" : ""}
          >
            {showReplyForm ? "Cancel" : "Reply"}
          </button>
        </div>
      </div>

      {showReplyForm && (
        <ReplyForm 
          reviewId={review.id} 
          moduleCode={moduleCode} 
          onSubmit={handleReplySubmit} 
        />
      )}

      <div className="replies">
        {Object.values(review.replies).map((reply) => (
          <div key={reply.id} className="reply">
            <div className="reply-header">
              <span className="author">{reply.author}</span>
              <span className="timestamp text-muted">
                {new Date(reply.timestamp).toLocaleString()}
              </span>
            </div>
            <div className="reply-content">{reply.content}</div>
            <div className="reply-actions">
              <button 
                onClick={() => handleReplyUpvote(reply.id)}
                className={upvotedReplies[reply.id] ? "upvoted" : ""}
                disabled={upvotedReplies[reply.id]}
              >
                {upvotedReplies[reply.id] ? "Upvoted" : "Upvote"} ({reply.upvotes})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewThread;