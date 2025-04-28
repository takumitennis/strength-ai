export type MuscleGroup = 'chest' | 'back' | 'legs' | 'arms' | 'core';

export type Exercise = {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  isCompound: boolean;
};

export type WorkoutSet = {
  id: string;
  exerciseId: string;
  weight: number; // in kg
  reps: number;
  date: string; // ISO string
  oneRepMax: number; // calculated 1RM
};

export type WorkoutLog = {
  id: string;
  date: string; // ISO string
  exercises: {
    exerciseId: string;
    sets: WorkoutSet[];
  }[];
  notes?: string;
};

export type StrengthRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export type StrengthStandard = {
  exerciseId: string;
  gender: 'male' | 'female';
  bodyWeight?: number; // optional for bodyweight-relative standards
  ranks: {
    E: number;
    D: number;
    C: number;
    B: number;
    A: number;
    S: number;
  };
};

export type UserProgress = {
  muscleGroups: Record<MuscleGroup, number>; // 0-100 percentage
  personalBests: Record<string, WorkoutSet>; // exerciseId -> best set
  strengthRanks: Record<string, StrengthRank>; // exerciseId -> rank
};