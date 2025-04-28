import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Challenge, ChallengeParticipant } from '@/types/challenge';

interface ChallengeState {
  challenges: Challenge[];
  isLoading: boolean;
  error: string | null;
  createChallenge: (challenge: Omit<Challenge, 'id'>) => Challenge;
  joinChallenge: (challengeId: string, participant: Omit<ChallengeParticipant, 'progress' | 'lastUpdated'>) => void;
  updateProgress: (challengeId: string, userId: string, progress: number) => void;
  getActiveUserChallenges: (userId: string) => Challenge[];
  getAvailableChallenges: (userId: string) => Challenge[];
}

export const useChallengeStore = create<ChallengeState>()(
  persist(
    (set, get) => ({
      challenges: [],
      isLoading: false,
      error: null,
      
      createChallenge: (challengeData) => {
        const newChallenge: Challenge = {
          id: Date.now().toString(),
          ...challengeData
        };
        
        set((state) => ({
          challenges: [...state.challenges, newChallenge]
        }));
        
        return newChallenge;
      },
      
      joinChallenge: (challengeId, participantData) => {
        const newParticipant: ChallengeParticipant = {
          ...participantData,
          progress: 0,
          lastUpdated: new Date().toISOString()
        };
        
        set((state) => ({
          challenges: state.challenges.map(challenge => 
            challenge.id === challengeId
              ? {
                  ...challenge,
                  participants: [...challenge.participants, newParticipant]
                }
              : challenge
          )
        }));
      },
      
      updateProgress: (challengeId, userId, progress) => {
        set((state) => ({
          challenges: state.challenges.map(challenge => 
            challenge.id === challengeId
              ? {
                  ...challenge,
                  participants: challenge.participants.map(participant => 
                    participant.userId === userId
                      ? {
                          ...participant,
                          progress,
                          lastUpdated: new Date().toISOString()
                        }
                      : participant
                  )
                }
              : challenge
          )
        }));
      },
      
      getActiveUserChallenges: (userId) => {
        return get().challenges.filter(challenge => 
          challenge.isActive && 
          challenge.participants.some(p => p.userId === userId)
        );
      },
      
      getAvailableChallenges: (userId) => {
        return get().challenges.filter(challenge => 
          challenge.isActive && 
          !challenge.participants.some(p => p.userId === userId)
        );
      }
    }),
    {
      name: 'challenge-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);