import { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useNewsStore } from '../../stores/newsStore';
import NewsCard from '../../components/NewsCard';

export default function IndianNewsScreen() {
  const { indianNews, loading, error, fetchIndianNews } = useNewsStore();

  useEffect(() => {
    fetchIndianNews();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={fetchIndianNews}
          tintColor="#FFFFFF"
        />
      }
    >
      <View style={styles.content}>
        {loading && !indianNews.length ? (
          <ActivityIndicator size="large\" color="#007AFF" />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          indianNews.map((item) => (
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
  error: {
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 20,
  },
});