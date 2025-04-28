export type User = {
  id: string;
  username: string;
  displayName: string;
  email: string;
  gender: 'male' | 'female' | 'other';
  weight: number; // in kg
  height: number; // in cm
  birthdate: string;
  avatarUrl?: string;
  bio?: string;
  joinDate: string;
  preferences: UserPreferences;
};

export type UserPreferences = {
  weightUnit: 'kg' | 'lb';
  language: 'ja' | 'en';
  darkMode: boolean;
  notifications: boolean;
};