import { useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useNewsStore } from '../../stores/newsStore';
import NewsCard from '../../components/NewsCard';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function IndianNewsScreen() {
  const { indianNews, loading, error, fetchIndianNews } = useNewsStore();

  useEffect(() => {
    fetchIndianNews();
  }, []);

  const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

  return (
    <AnimatedScrollView
      style={styles.container}
      entering={FadeIn}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={fetchIndianNews}
          tintColor="#FFFFFF"
        />
      }
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {loading && !indianNews.length ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        indianNews.map((item, index) => (
          <NewsCard key={item.id} item={item} index={index} />
        ))
      )}
    </AnimatedScrollView>
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