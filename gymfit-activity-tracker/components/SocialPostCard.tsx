import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Post } from '@/types/social';
import Card from './Card';
import Avatar from './Avatar';
import colors from '@/constants/colors';
import { getRelativeTime } from '@/utils/date-utils';
import { Heart, MessageCircle, Share2 } from 'lucide-react-native';

interface SocialPostCardProps {
  post: Post;
  onPress?: () => void;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  style?: any;
}

export default function SocialPostCard({ 
  post, 
  onPress,
  onLike,
  onComment,
  onShare,
  style 
}: SocialPostCardProps) {
  const relativeTime = getRelativeTime(post.createdAt);
  
  return (
    <Card 
      onPress={onPress}
      style={[styles.card, style]}
      contentStyle={styles.content}
    >
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Avatar 
            uri={post.avatarUrl} 
            size={40} 
          />
          <View style={styles.nameContainer}>
            <Text style={styles.username}>{post.username}</Text>
            <Text style={styles.time}>{relativeTime}</Text>
          </View>
        </View>
        <View style={styles.postType}>
          <Text style={styles.postTypeText}>
            {post.type === 'pr' ? 'PR達成' : 
             post.type === 'meal' ? '食事' : 
             post.type === 'workout' ? 'トレーニング' : '進捗'}
          </Text>
        </View>
      </View>
      
      <Text style={styles.content}>{post.content}</Text>
      
      {post.mediaUrl && (
        <Image 
          source={{ uri: post.mediaUrl }} 
          style={styles.media}
          resizeMode="cover"
        />
      )}
      
      {post.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {post.tags.map((tag, index) => (
            <Text key={index} style={styles.tag}>#{tag}</Text>
          ))}
        </View>
      )}
      
      <View style={styles.stats}>
        <Text style={styles.likesCount}>
          {post.likes} いいね
        </Text>
        <Text style={styles.commentsCount}>
          {post.comments.length} コメント
        </Text>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={onLike}
          activeOpacity={0.7}
        >
          <Heart size={20} color={colors.textLight} />
          <Text style={styles.actionText}>いいね</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={onComment}
          activeOpacity={0.7}
        >
          <MessageCircle size={20} color={colors.textLight} />
          <Text style={styles.actionText}>コメント</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={onShare}
          activeOpacity={0.7}
        >
          <Share2 size={20} color={colors.textLight} />
          <Text style={styles.actionText}>シェア</Text>
        </TouchableOpacity>
      </View>
      
      {post.comments.length > 0 && (
        <View style={styles.commentsContainer}>
          {post.comments.slice(0, 2).map((comment, index) => (
            <View key={index} style={styles.comment}>
              <Avatar 
                uri={comment.avatarUrl} 
                size={24} 
              />
              <View style={styles.commentContent}>
                <Text style={styles.commentUsername}>{comment.username}</Text>
                <Text style={styles.commentText}>{comment.content}</Text>
              </View>
            </View>
          ))}
          
          {post.comments.length > 2 && (
            <TouchableOpacity 
              style={styles.viewAllComments}
              onPress={onComment}
              activeOpacity={0.7}
            >
              <Text style={styles.viewAllCommentsText}>
                すべてのコメントを表示 ({post.comments.length})
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  content: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  nameContainer: {
    
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  time: {
    fontSize: 12,
    color: colors.textLight,
  },
  postType: {
    backgroundColor: colors.progressBackground,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  postTypeText: {
    fontSize: 12,
    color: colors.textLight,
  },
  media: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    fontSize: 14,
    color: colors.secondary,
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
  },
  likesCount: {
    fontSize: 12,
    color: colors.textLight,
  },
  commentsCount: {
    fontSize: 12,
    color: colors.textLight,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  actionText: {
    fontSize: 14,
    color: colors.textLight,
  },
  commentsContainer: {
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  comment: {
    flexDirection: 'row',
    gap: 8,
  },
  commentContent: {
    flex: 1,
    backgroundColor: colors.progressBackground,
    padding: 8,
    borderRadius: 8,
  },
  commentUsername: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  commentText: {
    fontSize: 14,
    color: colors.text,
  },
  viewAllComments: {
    paddingVertical: 4,
  },
  viewAllCommentsText: {
    fontSize: 14,
    color: colors.textLight,
  }
});