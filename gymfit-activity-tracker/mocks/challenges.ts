import { Challenge } from '@/types/challenge';

export const mockChallenges: Challenge[] = [
  {
    id: 'challenge1',
    title: '30日スクワットチャレンジ',
    description: '30日間で合計1000回のスクワットを達成しよう！',
    type: 'consistency',
    goal: 1000,
    unit: '回',
    startDate: '2023-11-01T00:00:00.000Z',
    endDate: '2023-11-30T23:59:59.999Z',
    participants: [
      {
        userId: 'user1',
        username: 'tanaka_fit',
        avatarUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop',
        progress: 75,
        lastUpdated: '2023-11-25T10:00:00.000Z'
      },
      {
        userId: 'user2',
        username: 'yamada_power',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
        progress: 82,
        lastUpdated: '2023-11-25T12:00:00.000Z'
      },
      {
        userId: 'user3',
        username: 'sato_muscle',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
        progress: 68,
        lastUpdated: '2023-11-24T18:00:00.000Z'
      }
    ],
    tags: ['スクワット', '30日チャレンジ', '脚トレ'],
    createdBy: 'user2',
    isActive: true
  },
  {
    id: 'challenge2',
    title: 'ベンチプレス100kg達成チャレンジ',
    description: '30日以内にベンチプレス100kgを1回挙げることを目指そう！',
    type: 'strength',
    goal: 100,
    unit: 'kg',
    startDate: '2023-11-15T00:00:00.000Z',
    endDate: '2023-12-15T23:59:59.999Z',
    participants: [
      {
        userId: 'user1',
        username: 'tanaka_fit',
        avatarUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop',
        progress: 90,
        lastUpdated: '2023-11-25T10:00:00.000Z'
      },
      {
        userId: 'user4',
        username: 'suzuki_gym',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop',
        progress: 85,
        lastUpdated: '2023-11-24T15:00:00.000Z'
      }
    ],
    tags: ['ベンチプレス', '筋力アップ', '胸トレ'],
    createdBy: 'user1',
    isActive: true
  },
  {
    id: 'challenge3',
    title: '週5回トレーニングチャレンジ',
    description: '1ヶ月間、週5回のトレーニングを継続しよう！',
    type: 'consistency',
    goal: 20,
    unit: '日',
    startDate: '2023-12-01T00:00:00.000Z',
    endDate: '2023-12-31T23:59:59.999Z',
    participants: [
      {
        userId: 'user2',
        username: 'yamada_power',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
        progress: 0,
        lastUpdated: '2023-11-25T12:00:00.000Z'
      },
      {
        userId: 'user3',
        username: 'sato_muscle',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
        progress: 0,
        lastUpdated: '2023-11-24T18:00:00.000Z'
      },
      {
        userId: 'user4',
        username: 'suzuki_gym',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop',
        progress: 0,
        lastUpdated: '2023-11-24T15:00:00.000Z'
      }
    ],
    tags: ['継続', '習慣化', 'トレーニング'],
    createdBy: 'user3',
    isActive: true
  }
];