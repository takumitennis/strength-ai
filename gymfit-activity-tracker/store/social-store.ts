import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Post, Comment } from '@/types/social';

interface SocialState {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  createPost: (post: Omit<Post, 'id' | 'likes' | 'comments' | 'createdAt'>) => Post;
  likePost: (postId: string) => void;
  unlikePost: (postId: string) => void;
  addComment: (postId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  deletePost: (postId: string) => void;
  getPostsByTag: (tag: string) => Post[];
  getPostsByUser: (userId: string) => Post[];
  getFeedPosts: (limit?: number) => Post[];
}

export const useSocialStore = create<SocialState>()(
  persist(
    (set, get) => ({
      posts: [],
      isLoading: false,
      error: null,
      
      createPost: (postData) => {
        const newPost: Post = {
          id: Date.now().toString(),
          likes: 0,
          comments: [],
          createdAt: new Date().toISOString(),
          ...postData
        };
        
        set((state) => ({
          posts: [newPost, ...state.posts]
        }));
        
        return newPost;
      },
      
      likePost: (postId) => {
        set((state) => ({
          posts: state.posts.map(post => 
            post.id === postId
              ? { ...post, likes: post.likes + 1 }
              : post
          )
        }));
      },
      
      unlikePost: (postId) => {
        set((state) => ({
          posts: state.posts.map(post => 
            post.id === postId && post.likes > 0
              ? { ...post, likes: post.likes - 1 }
              : post
          )
        }));
      },
      
      addComment: (postId, commentData) => {
        const newComment: Comment = {
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          ...commentData
        };
        
        set((state) => ({
          posts: state.posts.map(post => 
            post.id === postId
              ? { ...post, comments: [...post.comments, newComment] }
              : post
          )
        }));
      },
      
      deletePost: (postId) => {
        set((state) => ({
          posts: state.posts.filter(post => post.id !== postId)
        }));
      },
      
      getPostsByTag: (tag) => {
        return get().posts.filter(post => post.tags.includes(tag));
      },
      
      getPostsByUser: (userId) => {
        return get().posts.filter(post => post.userId === userId);
      },
      
      getFeedPosts: (limit = 20) => {
        return [...get().posts]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, limit);
      }
    }),
    {
      name: 'social-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);