import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Alert,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useChallengeStore } from '@/store/challenge-store';
import { useUserStore } from '@/store/user-store';
import colors from '@/constants/colors';
import ChallengeCard from '@/components/ChallengeCard';
import Button from '@/components/Button';
import { mockChallenges } from '@/mocks/challenges';
import { Challenge } from '@/types/challenge';
import { formatDateJP } from '@/utils/date-utils';
import { Plus, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function ChallengeScreen() {
  const { challenges, createChallenge, joinChallenge, updateProgress } = useChallengeStore();
  const { user } = useUserStore();
  
  const [activeTab, setActiveTab] = useState<'active' | 'available'>('active');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // New challenge form state
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    type: 'consistency',
    goal: '',
    unit: '',
    durationDays: '30',
    tags: ''
  });
  
  // Initialize with mock data if empty
  useEffect(() => {
    if (challenges.length === 0 && mockChallenges.length > 0) {
      mockChallenges.forEach(challenge => {
        useChallengeStore.getState().createChallenge(challenge);
      });
    }
  }, []);
  
  // Get active challenges for current user
  const activeUserChallenges = user ? 
    challenges.filter(challenge => 
      challenge.isActive && 
      challenge.participants.some(p => p.userId === user.id)
    ) : [];
  
  // Get available challenges for current user
  const availableChallenges = user ? 
    challenges.filter(challenge => 
      challenge.isActive && 
      !challenge.participants.some(p => p.userId === user.id)
    ) : [];
  
  // Join a challenge
  const handleJoinChallenge = (challengeId: string) => {
    if (!user) return;
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    joinChallenge(challengeId, {
      userId: user.id,
      username: user.username,
      avatarUrl: user.avatarUrl
    });
    
    Alert.alert('参加完了', 'チャレンジに参加しました！');
  };
  
  // Update challenge progress
  const handleUpdateProgress = (challengeId: string, progress: number) => {
    if (!user) return;
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    updateProgress(challengeId, user.id, progress);
  };
  
  // Create new challenge
  const handleCreateChallenge = () => {
    if (!user) return;
    
    // Validate form
    if (!newChallenge.title.trim()) {
      Alert.alert('エラー', 'タイトルを入力してください。');
      return;
    }
    
    if (!newChallenge.description.trim()) {
      Alert.alert('エラー', '説明を入力してください。');
      return;
    }
    
    if (!newChallenge.goal || isNaN(Number(newChallenge.goal))) {
      Alert.alert('エラー', '目標値を数値で入力してください。');
      return;
    }
    
    if (!newChallenge.unit.trim()) {
      Alert.alert('エラー', '単位を入力してください。');
      return;
    }
    
    if (!newChallenge.durationDays || isNaN(Number(newChallenge.durationDays))) {
      Alert.alert('エラー', '期間を数値で入力してください。');
      return;
    }
    
    // Calculate start and end dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + parseInt(newChallenge.durationDays));
    
    // Parse tags
    const tags = newChallenge.tags.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    // Create challenge
    const challenge: Omit<Challenge, 'id'> = {
      title: newChallenge.title,
      description: newChallenge.description,
      type: newChallenge.type as 'workout' | 'strength' | 'consistency',
      goal: parseInt(newChallenge.goal),
      unit: newChallenge.unit,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      participants: [{
        userId: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl,
        progress: 0,
        lastUpdated: new Date().toISOString()
      }],
      tags,
      createdBy: user.id,
      isActive: true
    };
    
    createChallenge(challenge);
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // Reset form and close modal
    setNewChallenge({
      title: '',
      description: '',
      type: 'consistency',
      goal: '',
      unit: '',
      durationDays: '30',
      tags: ''
    });
    
    setShowCreateModal(false);
    
    Alert.alert('作成完了', 'チャレンジを作成しました！');
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>チャレンジ</Text>
          <Button
            title="作成"
            onPress={() => setShowCreateModal(true)}
            icon={Plus}
            size="small"
          />
        </View>
        
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'active' && styles.activeTab
            ]}
            onPress={() => setActiveTab('active')}
          >
            <Text 
              style={[
                styles.tabText,
                activeTab === 'active' && styles.activeTabText
              ]}
            >
              参加中 ({activeUserChallenges.length})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'available' && styles.activeTab
            ]}
            onPress={() => setActiveTab('available')}
          >
            <Text 
              style={[
                styles.tabText,
                activeTab === 'available' && styles.activeTabText
              ]}
            >
              参加可能 ({availableChallenges.length})
            </Text>
          </TouchableOpacity>
        </View>
        
        {activeTab === 'active' ? (
          activeUserChallenges.length > 0 ? (
            activeUserChallenges.map(challenge => (
              <ChallengeCard 
                key={challenge.id}
                challenge={challenge}
                onPress={() => {}}
              />
            ))
          ) : (
            <View style={styles.emptyChallenges}>
              <Text style={styles.emptyChallengesText}>
                参加中のチャレンジはありません
              </Text>
              <Button
                title="チャレンジを探す"
                onPress={() => setActiveTab('available')}
                variant="outline"
                style={styles.emptyChallengesButton}
              />
            </View>
          )
        ) : (
          availableChallenges.length > 0 ? (
            availableChallenges.map(challenge => (
              <View key={challenge.id} style={styles.availableChallengeContainer}>
                <ChallengeCard 
                  challenge={challenge}
                  onPress={() => {}}
                />
                <Button
                  title="参加する"
                  onPress={() => handleJoinChallenge(challenge.id)}
                  style={styles.joinButton}
                  fullWidth
                />
              </View>
            ))
          ) : (
            <View style={styles.emptyChallenges}>
              <Text style={styles.emptyChallengesText}>
                参加可能なチャレンジはありません
              </Text>
              <Button
                title="チャレンジを作成"
                onPress={() => setShowCreateModal(true)}
                variant="outline"
                style={styles.emptyChallengesButton}
              />
            </View>
          )
        )}
      </ScrollView>
      
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>新しいチャレンジを作成</Text>
              <TouchableOpacity
                onPress={() => setShowCreateModal(false)}
                style={styles.closeButton}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>タイトル</Text>
                <TextInput
                  style={styles.input}
                  value={newChallenge.title}
                  onChangeText={(text) => setNewChallenge({...newChallenge, title: text})}
                  placeholder="例: 30日スクワットチャレンジ"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>説明</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={newChallenge.description}
                  onChangeText={(text) => setNewChallenge({...newChallenge, description: text})}
                  placeholder="チャレンジの詳細を入力..."
                  multiline
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>タイプ</Text>
                <View style={styles.typeButtons}>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      newChallenge.type === 'consistency' && styles.selectedTypeButton
                    ]}
                    onPress={() => setNewChallenge({...newChallenge, type: 'consistency'})}
                  >
                    <Text 
                      style={[
                        styles.typeButtonText,
                        newChallenge.type === 'consistency' && styles.selectedTypeButtonText
                      ]}
                    >
                      継続
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      newChallenge.type === 'strength' && styles.selectedTypeButton
                    ]}
                    onPress={() => setNewChallenge({...newChallenge, type: 'strength'})}
                  >
                    <Text 
                      style={[
                        styles.typeButtonText,
                        newChallenge.type === 'strength' && styles.selectedTypeButtonText
                      ]}
                    >
                      筋力
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      newChallenge.type === 'workout' && styles.selectedTypeButton
                    ]}
                    onPress={() => setNewChallenge({...newChallenge, type: 'workout'})}
                  >
                    <Text 
                      style={[
                        styles.typeButtonText,
                        newChallenge.type === 'workout' && styles.selectedTypeButtonText
                      ]}
                    >
                      トレーニング
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>目標値</Text>
                  <TextInput
                    style={styles.input}
                    value={newChallenge.goal}
                    onChangeText={(text) => setNewChallenge({...newChallenge, goal: text})}
                    placeholder="例: 1000"
                    keyboardType="numeric"
                  />
                </View>
                
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>単位</Text>
                  <TextInput
                    style={styles.input}
                    value={newChallenge.unit}
                    onChangeText={(text) => setNewChallenge({...newChallenge, unit: text})}
                    placeholder="例: 回"
                  />
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>期間（日数）</Text>
                <TextInput
                  style={styles.input}
                  value={newChallenge.durationDays}
                  onChangeText={(text) => setNewChallenge({...newChallenge, durationDays: text})}
                  placeholder="例: 30"
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>タグ（カンマ区切り）</Text>
                <TextInput
                  style={styles.input}
                  value={newChallenge.tags}
                  onChangeText={(text) => setNewChallenge({...newChallenge, tags: text})}
                  placeholder="例: スクワット, 30日チャレンジ, 脚トレ"
                />
              </View>
              
              <Button
                title="チャレンジを作成"
                onPress={handleCreateChallenge}
                style={styles.createButton}
                fullWidth
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: colors.progressBackground,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: colors.cardBackground,
  },
  tabText: {
    fontSize: 14,
    color: colors.textLight,
  },
  activeTabText: {
    fontWeight: 'bold',
    color: colors.text,
  },
  emptyChallenges: {
    padding: 32,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyChallengesText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyChallengesButton: {
    
  },
  availableChallengeContainer: {
    marginBottom: 24,
  },
  joinButton: {
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    width: '100%',
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.progressBackground,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: colors.progressBackground,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedTypeButton: {
    backgroundColor: colors.primary,
  },
  typeButtonText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedTypeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  createButton: {
    marginTop: 16,
    marginBottom: 32,
  }
});