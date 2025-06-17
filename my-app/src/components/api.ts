const API_BASE_URL = 'http://localhost:8000';

export interface Review {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  rating: number;
  upvotes: number;
  replies: Record<string, Reply>;
}

export interface Reply {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  upvotes: number;
}

export const getReviews = async (moduleCode: string): Promise<Record<string, Review>> => {
  const response = await fetch(`${API_BASE_URL}/modules/${moduleCode}/reviews`);
  if (!response.ok) {
    throw new Error('Failed to fetch reviews');
  }
  return await response.json();
};

export const postReview = async (
  moduleCode: string,
  author: string,
  content: string,
  rating: number
): Promise<{ status: string; review_id: string }> => {
  const response = await fetch(`${API_BASE_URL}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      module_code: moduleCode,
      author,
      content,
      rating,
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to post review');
  }
  return await response.json();
};

export const postReply = async (
  moduleCode: string,
  reviewId: string,
  author: string,
  content: string
): Promise<{ status: string; reply_id: string }> => {
  const response = await fetch(`${API_BASE_URL}/replies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      module_code: moduleCode,
      review_id: reviewId,
      author,
      content,
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to post reply');
  }
  return await response.json();
};

export const upvoteReview = async (moduleCode: string, reviewId: string) => {
  const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/upvote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      module_code: moduleCode,
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to upvote review');
  }
  return await response.json();
};

export const upvoteReply = async (moduleCode: string, reviewId: string, replyId: string) => {
  const response = await fetch(`${API_BASE_URL}/replies/${replyId}/upvote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      module_code: moduleCode,
      review_id: reviewId,
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to upvote reply');
  }
  return await response.json();
};