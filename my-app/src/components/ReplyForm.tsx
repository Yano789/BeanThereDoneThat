import React, { useState } from 'react';

interface ReplyFormProps {
  reviewId: string;
  moduleCode: string;
  onSubmit: (content: string) => void;
}

const ReplyForm: React.FC<ReplyFormProps> = ({ reviewId, moduleCode, onSubmit }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(content);
    setContent('');
  };

  return (
    <div className="reply-form">
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a reply..."
          required
        />
        <div className="form-actions">
          <button type="submit">Post Reply</button>
          <button 
            type="button" 
            className="secondary"
            onClick={() => setContent('')}
            disabled={!content}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReplyForm;