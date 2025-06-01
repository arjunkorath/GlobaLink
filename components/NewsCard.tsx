import { View, Text, Image, TouchableOpacity, StyleSheet, Platform, Modal } from 'react-native';
import { Bookmark, MessageSquareMore } from 'lucide-react-native';
import { useNewsStore } from '../stores/newsStore';
import * as WebBrowser from 'expo-web-browser';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useState } from 'react';
import AIChatModal from './AIChatModal';

const DEFAULT_IMAGE = 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg';

interface NewsCardProps {
  item: {
    id: string;
    title: string;
    description: string;
    published: string;
    link: string;
    imageUrl?: string;
    source: string;
  };
  index: number;
}

export default function NewsCard({ item, index }: NewsCardProps) {
  const { bookmarks, toggleBookmark } = useNewsStore();
  const isBookmarked = bookmarks.some((bookmark) => bookmark.id === item.id);
  const [isAIChatVisible, setIsAIChatVisible] = useState(false);

  const handlePress = async () => {
    if (Platform.OS === 'web') {
      window.open(item.link, '_blank', 'noopener,noreferrer');
    } else {
      await WebBrowser.openBrowserAsync(item.link);
    }
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 100)}
      style={styles.card}
    >
      <TouchableOpacity onPress={handlePress}>
        <Image 
          source={{ uri: item.imageUrl || DEFAULT_IMAGE }} 
          style={styles.image}
        />
        <View style={styles.content}>
          <Text style={styles.source}>{item.source}</Text>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description} numberOfLines={3}>
            {item.description}
          </Text>
          <View style={styles.footer}>
            <Text style={styles.date}>
              {new Date(item.published).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => setIsAIChatVisible(true)}
                style={styles.actionButton}
              >
                <MessageSquareMore
                  size={20}
                  color="#007AFF"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => toggleBookmark(item)}
                style={styles.actionButton}
              >
                <Bookmark
                  size={20}
                  color={isBookmarked ? '#007AFF' : '#8E8E93'}
                  fill={isBookmarked ? '#007AFF' : 'transparent'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <AIChatModal
        isVisible={isAIChatVisible}
        onClose={() => setIsAIChatVisible(false)}
        articleContent={{
          title: item.title,
          description: item.description
        }}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  source: {
    color: '#007AFF',
    fontSize: 14,
    marginBottom: 4,
    fontWeight: '600',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 24,
  },
  description: {
    color: '#8E8E93',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    color: '#8E8E93',
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
});