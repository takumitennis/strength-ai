import { Post } from '@/types/social';

export const mockPosts: Post[] = [
  {
    id: 'post1',
    userId: 'user1',
    username: 'tanaka_fit',
    avatarUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop',
    content: '今日のトレーニングでベンチプレス120kgを達成しました！自己ベスト更新！💪',
    mediaUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    tags: ['ベンチプレス', 'PR', '胸トレ'],
    likes: 24,
    comments: [
      {
        id: 'comment1',
        userId: 'user2',
        username: 'yamada_power',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
        content: 'すごい！おめでとう！',
        createdAt: '2023-11-20T11:00:00.000Z'
      },
      {
        id: 'comment2',
        userId: 'user3',
        username: 'sato_muscle',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
        content: 'フォームも完璧だね！',
        createdAt: '2023-11-20T12:30:00.000Z'
      }
    ],
    createdAt: '2023-11-20T10:30:00.000Z',
    type: 'pr'
  },
  {
    id: 'post2',
    userId: 'user2',
    username: 'yamada_power',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    content: '今日の食事。プロテイン多めで筋肉の回復を促進！🍗🥗',
    mediaUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    tags: ['食事', 'プロテイン', '筋肉回復'],
    likes: 15,
    comments: [
      {
        id: 'comment3',
        userId: 'user1',
        username: 'tanaka_fit',
        avatarUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop',
        content: '栄養バランス良さそう！何グラムのプロテイン摂ってる？',
        createdAt: '2023-11-22T13:00:00.000Z'
      }
    ],
    createdAt: '2023-11-22T12:00:00.000Z',
    type: 'meal'
  },
  {
    id: 'post3',
    userId: 'user3',
    username: 'sato_muscle',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    content: 'デッドリフトのフォームチェック。背中が丸まらないように注意！',
    mediaUrl: 'https://images.unsplash.com/photo-1598971639058-a2afa2d1ce4a?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    tags: ['デッドリフト', 'フォームチェック', '背中トレ'],
    likes: 18,
    comments: [
      {
        id: 'comment4',
        userId: 'user4',
        username: 'suzuki_gym',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop',
        content: '腰を痛めないように気をつけて！',
        createdAt: '2023-11-24T10:00:00.000Z'
      }
    ],
    createdAt: '2023-11-24T09:00:00.000Z',
    type: 'workout'
  },
  {
    id: 'post4',
    userId: 'user1',
    username: 'tanaka_fit',
    avatarUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop',
    content: '3ヶ月間のトレーニング成果。体重は変わらず、体脂肪率が5%減！',
    mediaUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    tags: ['ビフォーアフター', '体脂肪率', '筋肉増量'],
    likes: 32,
    comments: [
      {
        id: 'comment5',
        userId: 'user2',
        username: 'yamada_power',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
        content: '素晴らしい変化！食事管理も頑張ったの？',
        createdAt: '2023-11-25T14:00:00.000Z'
      },
      {
        id: 'comment6',
        userId: 'user3',
        username: 'sato_muscle',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
        content: 'モチベーション上がる！',
        createdAt: '2023-11-25T15:30:00.000Z'
      }
    ],
    createdAt: '2023-11-25T13:00:00.000Z',
    type: 'progress'
  }
];