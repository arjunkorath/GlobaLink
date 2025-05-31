import { View, Text, Image, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Bookmark } from 'lucide-react-native';
import { useNewsStore } from '../stores/newsStore';

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
}

export default function NewsCard({ item }: NewsCardProps) {
  const { bookmarks, toggleBookmark } = useNewsStore();
  const isBookmarked = bookmarks.some((bookmark) => bookmark.id === item.id);

  const handlePress = () => {
    Linking.openURL(item.link);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
      )}
      <View style={styles.content}>
        <Text style={styles.source}>{item.source}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={3}>
          {item.description}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.date}>
            {new Date(item.published).toLocaleDateString()}
          </Text>
          <TouchableOpacity
            onPress={() => toggleBookmark(item)}
            style={styles.bookmarkButton}
          >
            <Bookmark
              size={20}
              color={isBookmarked ? '#007AFF' : '#8E8E93'}
              fill={isBookmarked ? '#007AFF' : 'transparent'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  source: {
    color: '#007AFF',
    fontSize: 14,
    marginBottom: 4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
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
  bookmarkButton: {
    padding: 4,
  },
});