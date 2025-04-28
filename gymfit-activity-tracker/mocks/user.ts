import { User } from '@/types/user';
import { UserProgress } from '@/types/workout';

export const mockUser: User = {
  id: 'user1',
  username: 'tanaka_fit',
  displayName: '田中 健太',
  email: 'tanaka@example.com',
  gender: 'male',
  weight: 75,
  height: 175,
  birthdate: '1990-05-15',
  avatarUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop',
  bio: '筋トレ歴5年。ベンチプレス120kg、スクワット160kg、デッドリフト200kg。',
  joinDate: '2023-01-15T00:00:00.000Z',
  preferences: {
    weightUnit: 'kg',
    language: 'ja',
    darkMode: false,
    notifications: true
  }
};

export const mockUserProgress: UserProgress = {
  muscleGroups: {
    chest: 75,
    back: 80,
    legs: 65,
    arms: 70,
    core: 60
  },
  personalBests: {
    'bench-press': {
      id: 'pb1',
      exerciseId: 'bench-press',
      weight: 120,
      reps: 1,
      date: '2023-10-15T00:00:00.000Z',
      oneRepMax: 120
    },
    'squat': {
      id: 'pb2',
      exerciseId: 'squat',
      weight: 160,
      reps: 1,
      date: '2023-09-20T00:00:00.000Z',
      oneRepMax: 160
    },
    'deadlift': {
      id: 'pb3',
      exerciseId: 'deadlift',
      weight: 200,
      reps: 1,
      date: '2023-11-05T00:00:00.000Z',
      oneRepMax: 200
    }
  },
  strengthRanks: {
    'bench-press': 'C',
    'squat': 'C',
    'deadlift': 'B'
  }
};