export type Challenge = {
  id: string;
  title: string;
  description: string;
  type: 'workout' | 'strength' | 'consistency';
  goal: number;
  unit: string;
  startDate: string;
  endDate: string;
  participants: ChallengeParticipant[];
  tags: string[];
  createdBy: string;
  isActive: boolean;
};

export type ChallengeParticipant = {
  userId: string;
  username: string;
  avatarUrl?: string;
  progress: number; // 0-100 percentage
  lastUpdated: string;
};