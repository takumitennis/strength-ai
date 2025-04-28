import { StrengthRank } from '@/types/workout';

// Calculate one-rep max using Brzycki formula
export function calculateOneRepMax(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return weight * (36 / (37 - reps));
}

// Strength standards for common exercises (simplified)
const strengthStandards = {
  // Squat standards for males (in kg)
  'squat-male': {
    E: 120,
    D: 140,
    C: 160,
    B: 180,
    A: 200,
    S: 220
  },
  // Squat standards for females (in kg)
  'squat-female': {
    E: 60,
    D: 75,
    C: 90,
    B: 105,
    A: 120,
    S: 135
  },
  // Bench press standards for males (in kg)
  'bench-male': {
    E: 80,
    D: 100,
    C: 120,
    B: 140,
    A: 160,
    S: 180
  },
  // Bench press standards for females (in kg)
  'bench-female': {
    E: 40,
    D: 50,
    C: 60,
    B: 70,
    A: 80,
    S: 90
  },
  // Deadlift standards for males (in kg)
  'deadlift-male': {
    E: 140,
    D: 160,
    C: 180,
    B: 200,
    A: 220,
    S: 240
  },
  // Deadlift standards for females (in kg)
  'deadlift-female': {
    E: 80,
    D: 100,
    C: 120,
    B: 140,
    A: 160,
    S: 180
  }
};

// Calculate strength rank based on 1RM
export function calculateStrengthRank(
  exerciseId: string,
  oneRepMax: number,
  gender: 'male' | 'female' | 'other'
): StrengthRank {
  // Default to male standards if gender is 'other'
  const genderKey = gender === 'other' ? 'male' : gender;
  
  // Get the appropriate standards for this exercise and gender
  const standardKey = `${exerciseId}-${genderKey}`;
  const standards = strengthStandards[standardKey] || strengthStandards['squat-male']; // Fallback
  
  // Determine rank based on 1RM
  if (oneRepMax >= standards.S) return 'S';
  if (oneRepMax >= standards.A) return 'A';
  if (oneRepMax >= standards.B) return 'B';
  if (oneRepMax >= standards.C) return 'C';
  if (oneRepMax >= standards.D) return 'D';
  return 'E';
}

// Format weight with unit
export function formatWeight(weight: number, unit: 'kg' | 'lb' = 'kg'): string {
  if (unit === 'lb') {
    // Convert kg to lb
    const weightInLb = weight * 2.20462;
    return `${weightInLb.toFixed(1)} lb`;
  }
  return `${weight.toFixed(1)} kg`;
}

// Get color for muscle group
export function getMuscleGroupColor(muscleGroup: string): string {
  const colors = {
    chest: '#F87171', // Red
    back: '#60A5FA', // Blue
    legs: '#34D399', // Green
    arms: '#FBBF24', // Yellow
    core: '#A78BFA', // Purple
    rest: '#CBD5E1', // Gray
  };
  
  return colors[muscleGroup] || colors.rest;
}

// Get rank color
export function getRankColor(rank: StrengthRank): string {
  const colors = {
    S: '#8B5CF6', // Purple
    A: '#3B82F6', // Blue
    B: '#10B981', // Green
    C: '#F59E0B', // Yellow
    D: '#F97316', // Orange
    E: '#EF4444', // Red
  };
  
  return colors[rank] || colors.E;
}