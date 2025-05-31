import { useState } from 'react';
import { View, TextInput, StyleSheet, ScrollView, Text } from 'react-native';
import { Search } from 'lucide-react-native';
import { useNewsStore } from '../../stores/newsStore';
import NewsCard from '../../components/NewsCard';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const { indianNews, globalNews } = useNewsStore();

  const allNews = [...indianNews, ...globalNews];
  const filteredNews = query
    ? allNews.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search size={20} color="#8E8E93" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search news..."
          placeholderTextColor="#8E8E93"
          value={query}
          onChangeText={setQuery}
        />
      </View>
      <ScrollView style={styles.results}>
        {query ? (
          filteredNews.length > 0 ? (
            filteredNews.map((item) => <NewsCard key={item.id} item={item} />)
          ) : (
            <Text style={styles.noResults}>No results found</Text>
          )
        ) : (
          <Text style={styles.hint}>Start typing to search news</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  results: {
    flex: 1,
  },
  noResults: {
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  hint: {
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});