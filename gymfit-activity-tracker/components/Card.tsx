import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '@/constants/colors';

interface CardProps {
  title?: string;
  children: ReactNode;
  onPress?: () => void;
  style?: any;
  contentStyle?: any;
}

export default function Card({ 
  title, 
  children, 
  onPress, 
  style,
  contentStyle
}: CardProps) {
  const CardComponent = onPress ? TouchableOpacity : View;
  
  return (
    <CardComponent 
      style={[styles.card, style]} onPress={onPress}
      activeOpacity={0.7}
    >
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
    </CardComponent>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: colors.text,
  },
  content: {
    
  }
});