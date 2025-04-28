export type Post = {
  id: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  tags: string[];
  likes: number;
  comments: Comment[];
  createdAt: string;
  type: 'workout' | 'meal' | 'progress' | 'pr';
  workoutId?: string;
};

export type Comment = {
  id: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  content: string;
  createdAt: string;
};