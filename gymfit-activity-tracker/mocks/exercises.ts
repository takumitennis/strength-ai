import { Exercise } from '@/types/workout';

export const mockExercises: Exercise[] = [
  // Chest exercises
  {
    id: 'bench-press',
    name: 'ベンチプレス',
    muscleGroup: 'chest',
    isCompound: true
  },
  {
    id: 'incline-bench-press',
    name: 'インクラインベンチプレス',
    muscleGroup: 'chest',
    isCompound: true
  },
  {
    id: 'dumbbell-fly',
    name: 'ダンベルフライ',
    muscleGroup: 'chest',
    isCompound: false
  },
  {
    id: 'push-up',
    name: '腕立て伏せ',
    muscleGroup: 'chest',
    isCompound: true
  },
  
  // Back exercises
  {
    id: 'deadlift',
    name: 'デッドリフト',
    muscleGroup: 'back',
    isCompound: true
  },
  {
    id: 'pull-up',
    name: '懸垂',
    muscleGroup: 'back',
    isCompound: true
  },
  {
    id: 'barbell-row',
    name: 'バーベルロウ',
    muscleGroup: 'back',
    isCompound: true
  },
  {
    id: 'lat-pulldown',
    name: 'ラットプルダウン',
    muscleGroup: 'back',
    isCompound: false
  },
  
  // Legs exercises
  {
    id: 'squat',
    name: 'スクワット',
    muscleGroup: 'legs',
    isCompound: true
  },
  {
    id: 'leg-press',
    name: 'レッグプレス',
    muscleGroup: 'legs',
    isCompound: true
  },
  {
    id: 'leg-extension',
    name: 'レッグエクステンション',
    muscleGroup: 'legs',
    isCompound: false
  },
  {
    id: 'leg-curl',
    name: 'レッグカール',
    muscleGroup: 'legs',
    isCompound: false
  },
  
  // Arms exercises
  {
    id: 'bicep-curl',
    name: 'ビセップカール',
    muscleGroup: 'arms',
    isCompound: false
  },
  {
    id: 'tricep-extension',
    name: 'トライセップエクステンション',
    muscleGroup: 'arms',
    isCompound: false
  },
  {
    id: 'hammer-curl',
    name: 'ハンマーカール',
    muscleGroup: 'arms',
    isCompound: false
  },
  {
    id: 'skull-crusher',
    name: 'スカルクラッシャー',
    muscleGroup: 'arms',
    isCompound: false
  },
  
  // Core exercises
  {
    id: 'plank',
    name: 'プランク',
    muscleGroup: 'core',
    isCompound: false
  },
  {
    id: 'russian-twist',
    name: 'ロシアンツイスト',
    muscleGroup: 'core',
    isCompound: false
  },
  {
    id: 'hanging-leg-raise',
    name: 'ハンギングレッグレイズ',
    muscleGroup: 'core',
    isCompound: false
  },
  {
    id: 'ab-wheel',
    name: 'アブホイール',
    muscleGroup: 'core',
    isCompound: false
  }
];