import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSocialStore } from '@/store/social-store';
import { useUserStore } from '@/store/user-store';
import colors from '@/constants/colors';
import SocialPostCard from '@/components/SocialPostCard';
import Button from '@/components/Button';
import Avatar from '@/components/Avatar';
import { mockPosts } from '@/mocks/social';
import { Post } from '@/types/social';
import { Camera, Image as ImageIcon, Plus, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function SocialScreen() {
  const { posts, createPost, likePost, addComment } = useSocialStore();
  const { user } = useUserStore();
  
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // New post form state
  const [newPost, setNewPost] = useState({
    content: '',
    tags: '',
    type: 'workout' as 'workout' | 'meal' | 'progress' | 'pr',
    mediaUrl: ''
  });
  
  // Initialize with mock data if empty
  useEffect(() => {
    if (posts.length === 0 && mockPosts.length > 0) {
      mockPosts.forEach(post => {
        useSocialStore.getState().createPost(post);
      });
    }
  }, []);
  
  // Get filtered posts
  const filteredPosts = activeTag 
    ? posts.filter(post => post.tags.includes(activeTag))
    : posts;
  
  // Sort posts by date (newest first)
  const sortedPosts = [...filteredPosts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  // Get unique tags from all posts
  const allTags = Array.from(
    new Set(
      posts.flatMap(post => post.tags)
    )
  );
  
  // Handle like post
  const handleLikePost = (postId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    likePost(postId);
  };
  
  // Handle comment on post
  const handleCommentPost = (postId: string) => {
    if (!user) return;
    
    Alert.prompt(
      'コメントを追加',
      '',
      [
        {
          text: 'キャンセル',
          style: 'cancel'
        },
        {
          text: '投稿',
          onPress: (comment) => {
            if (comment && comment.trim()) {
              addComment(postId, {
                userId: user.id,
                username: user.username,
                avatarUrl: user.avatarUrl,
                content: comment.trim()
              });
              
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
            }
          }
        }
      ]
    );
  };
  
  // Handle share post
  const handleSharePost = (postId: string) => {
    Alert.alert('共有', '共有機能は現在開発中です。');
  };
  
  // Create new post
  const handleCreatePost = () => {
    if (!user) return;
    
    // Validate form
    if (!newPost.content.trim()) {
      Alert.alert('エラー', '投稿内容を入力してください。');
      return;
    }
    
    // Parse tags
    const tags = newPost.tags.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    // Create post
    const post: Omit<Post, 'id' | 'likes' | 'comments' | 'createdAt'> = {
      userId: user.id,
      username: user.username,
      avatarUrl: user.avatarUrl,
      content: newPost.content.trim(),
      tags,
      type: newPost.type,
      mediaUrl: newPost.mediaUrl || undefined,
      mediaType: newPost.mediaUrl ? 'image' : undefined
    };
    
    createPost(post);
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // Reset form and close modal
    setNewPost({
      content: '',
      tags: '',
      type: 'workout',
      mediaUrl: ''
    });
    
    setShowCreateModal(false);
    
    Alert.alert('投稿完了', '投稿が完了しました！');
  };
  
  // Sample media URLs for demo
  const sampleMediaUrls = [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1598971639058-a2afa2d1ce4a?q=80&w=1000&auto=format&fit=crop'
  ];
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>タイムライン</Text>
          <Button
            title="投稿"
            onPress={() => setShowCreateModal(true)}
            icon={Plus}
            size="small"
          />
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tagsScroll}
          contentContainerStyle={styles.tagsContainer}
        >
          <TouchableOpacity
            style={[
              styles.tagButton,
              activeTag === null && styles.activeTagButton
            ]}
            onPress={() => setActiveTag(null)}
          >
            <Text 
              style={[
                styles.tagButtonText,
                activeTag === null && styles.activeTagButtonText
              ]}
            >
              すべて
            </Text>
          </TouchableOpacity>
          
          {allTags.map((tag, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.tagButton,
                activeTag === tag && styles.activeTagButton
              ]}
              onPress={() => setActiveTag(tag)}
            >
              <Text 
                style={[
                  styles.tagButtonText,
                  activeTag === tag && styles.activeTagButtonText
                ]}
              >
                #{tag}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {sortedPosts.length > 0 ? (
          sortedPosts.map(post => (
            <SocialPostCard 
              key={post.id}
              post={post}
              onPress={() => {}}
              onLike={() => handleLikePost(post.id)}
              onComment={() => handleCommentPost(post.id)}
              onShare={() => handleSharePost(post.id)}
            />
          ))
        ) : (
          <View style={styles.emptyPosts}>
            <Text style={styles.emptyPostsText}>
              投稿がありません
            </Text>
            <Button
              title="最初の投稿を作成"
              onPress={() => setShowCreateModal(true)}
              variant="outline"
              style={styles.emptyPostsButton}
            />
          </View>
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
              <Text style={styles.modalTitle}>新しい投稿を作成</Text>
              <TouchableOpacity
                onPress={() => setShowCreateModal(false)}
                style={styles.closeButton}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <View style={styles.postHeader}>
                {user && (
                  <View style={styles.userInfo}>
                    <Avatar 
                      uri={user.avatarUrl} 
                      size={40} 
                    />
                    <Text style={styles.username}>{user.username}</Text>
                  </View>
                )}
                
                <View style={styles.postTypeButtons}>
                  <TouchableOpacity
                    style={[
                      styles.postTypeButton,
                      newPost.type === 'workout' && styles.selectedPostTypeButton
                    ]}
                    onPress={() => setNewPost({...newPost, type: 'workout'})}
                  >
                    <Text 
                      style={[
                        styles.postTypeButtonText,
                        newPost.type === 'workout' && styles.selectedPostTypeButtonText
                      ]}
                    >
                      トレーニング
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.postTypeButton,
                      newPost.type === 'meal' && styles.selectedPostTypeButton
                    ]}
                    onPress={() => setNewPost({...newPost, type: 'meal'})}
                  >
                    <Text 
                      style={[
                        styles.postTypeButtonText,
                        newPost.type === 'meal' && styles.selectedPostTypeButtonText
                      ]}
                    >
                      食事
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.postTypeButton,
                      newPost.type === 'progress' && styles.selectedPostTypeButton
                    ]}
                    onPress={() => setNewPost({...newPost, type: 'progress'})}
                  >
                    <Text 
                      style={[
                        styles.postTypeButtonText,
                        newPost.type === 'progress' && styles.selectedPostTypeButtonText
                      ]}
                    >
                      進捗
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.postTypeButton,
                      newPost.type === 'pr' && styles.selectedPostTypeButton
                    ]}
                    onPress={() => setNewPost({...newPost, type: 'pr'})}
                  >
                    <Text 
                      style={[
                        styles.postTypeButtonText,
                        newPost.type === 'pr' && styles.selectedPostTypeButtonText
                      ]}
                    >
                      PR達成
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <TextInput
                style={styles.contentInput}
                value={newPost.content}
                onChangeText={(text) => setNewPost({...newPost, content: text})}
                placeholder="投稿内容を入力..."
                multiline
              />
              
              {newPost.mediaUrl ? (
                <View style={styles.mediaPreviewContainer}>
                  <Image 
                    source={{ uri: newPost.mediaUrl }} 
                    style={styles.mediaPreview}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    style={styles.removeMediaButton}
                    onPress={() => setNewPost({...newPost, mediaUrl: ''})}
                  >
                    <X size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.mediaButtons}>
                  <Button
                    title="写真を選択"
                    onPress={() => {
                      // For demo, just use a random sample image
                      const randomIndex = Math.floor(Math.random() * sampleMediaUrls.length);
                      setNewPost({...newPost, mediaUrl: sampleMediaUrls[randomIndex]});
                    }}
                    icon={ImageIcon}
                    variant="outline"
                    style={styles.mediaButton}
                  />
                  
                  <Button
                    title="カメラで撮影"
                    onPress={() => {
                      // For demo, just use a random sample image
                      const randomIndex = Math.floor(Math.random() * sampleMediaUrls.length);
                      setNewPost({...newPost, mediaUrl: sampleMediaUrls[randomIndex]});
                    }}
                    icon={Camera}
                    variant="outline"
                    style={styles.mediaButton}
                  />
                </View>
              )}
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>タグ（カンマ区切り）</Text>
                <TextInput
                  style={styles.input}
                  value={newPost.tags}
                  onChangeText={(text) => setNewPost({...newPost, tags: text})}
                  placeholder="例: ベンチプレス, PR, 胸トレ"
                />
              </View>
              
              <Button
                title="投稿する"
                onPress={handleCreatePost}
                style={styles.postButton}
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
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  tagsScroll: {
    marginBottom: 16,
  },
  tagsContainer: {
    paddingRight: 16,
    gap: 8,
  },
  tagButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.progressBackground,
    borderRadius: 16,
  },
  activeTagButton: {
    backgroundColor: colors.primary,
  },
  tagButtonText: {
    fontSize: 14,
    color: colors.textLight,
  },
  activeTagButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyPosts: {
    padding: 32,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyPostsText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyPostsButton: {
    
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
  postHeader: {
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  postTypeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  postTypeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.progressBackground,
    borderRadius: 16,
  },
  selectedPostTypeButton: {
    backgroundColor: colors.primary,
  },
  postTypeButtonText: {
    fontSize: 14,
    color: colors.textLight,
  },
  selectedPostTypeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  contentInput: {
    height: 120,
    backgroundColor: colors.progressBackground,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  mediaButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  mediaButton: {
    flex: 1,
  },
  mediaPreviewContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  mediaPreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeMediaButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formGroup: {
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
  postButton: {
    marginTop: 16,
    marginBottom: 32,
  }
});