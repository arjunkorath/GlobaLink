import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNewsStore } from '../../stores/newsStore';
import NewsCard from '../../components/NewsCard';

export default function BookmarksScreen() {
  const { bookmarks } = useNewsStore();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {bookmarks.length === 0 ? (
          <Text style={styles.emptyText}>No bookmarked articles yet</Text>
        ) : (
          bookmarks.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    padding: 16,
  },
  emptyText: {
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});