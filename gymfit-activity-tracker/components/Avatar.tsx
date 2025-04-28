import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '@/constants/colors';

interface AvatarProps {
  uri?: string;
  size?: number;
  bordered?: boolean;
  style?: any;
}

export default function Avatar({ 
  uri, 
  size = 50, 
  bordered = false,
  style 
}: AvatarProps) {
  const defaultAvatar = 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=200&auto=format&fit=crop';
  
  return (
    <View 
      style={[
        styles.container, 
        { 
          width: size, 
          height: size, 
          borderRadius: size / 2 
        },
        style
      ]}
    >
      {bordered && (
        <LinearGradient
          colors={[colors.secondary, colors.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.border,
            { 
              width: size + 6, 
              height: size + 6, 
              borderRadius: (size + 6) / 2 
            }
          ]}
        />
      )}
      <Image
        source={{ uri: uri || defaultAvatar }}
        style={[
          styles.image,
          { 
            width: size, 
            height: size, 
            borderRadius: size / 2 
          }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  border: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    backgroundColor: colors.progressBackground,
  }
});