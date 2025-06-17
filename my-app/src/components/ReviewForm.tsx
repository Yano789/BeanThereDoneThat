import React, { useState } from 'react';

interface ReviewFormProps {
  moduleCode: string;
  onSubmit: (content: string, rating: number) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ moduleCode, onSubmit }) => {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(content, rating);
    setContent('');
    setRating(5);
  };

  return (
    <div className="review-form">
      <h3>Post a review for {moduleCode}</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts about this module..."
          required
        />
        <div className="rating-selector">
          <label>Rating:</label>
          <select 
            value={rating} 
            onChange={(e) => setRating(Number(e.target.value))}
            required
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>{num} star{num !== 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
        <div className="form-actions">
          <button type="submit">Post Review</button>
          <button 
            type="button" 
            className="secondary"
            onClick={() => {
              setContent('');
              setRating(5);
            }}
            disabled={!content && rating === 5}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;