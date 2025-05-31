import { create } from 'zustand';
import * as rssParser from 'react-native-rss-parser';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  published: string;
  link: string;
  imageUrl?: string;
  source: string;
}

interface NewsStore {
  indianNews: NewsItem[];
  globalNews: NewsItem[];
  bookmarks: NewsItem[];
  loading: boolean;
  error: string | null;
  fetchIndianNews: () => Promise<void>;
  fetchGlobalNews: () => Promise<void>;
  toggleBookmark: (item: NewsItem) => void;
}

const NEWS_SOURCES = {
  indian: [
    'https://timesofindia.indiatimes.com/rssfeedstopstories.cms',
    'https://www.thehindu.com/news/national/feeder/default.rss',
  ],
  global: [
    'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
    'https://feeds.bbci.co.uk/news/world/rss.xml',
  ],
};

export const useNewsStore = create<NewsStore>((set, get) => ({
  indianNews: [],
  globalNews: [],
  bookmarks: [],
  loading: false,
  error: null,

  fetchIndianNews: async () => {
    set({ loading: true, error: null });
    try {
      const newsPromises = NEWS_SOURCES.indian.map(async (url) => {
        const response = await fetch(url);
        const text = await response.text();
        const feed = await rssParser.parse(text);
        return feed.items.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          published: item.published,
          link: item.links[0]?.url,
          imageUrl: item.enclosures?.[0]?.url,
          source: new URL(url).hostname,
        }));
      });

      const allNews = await Promise.all(newsPromises);
      set({ indianNews: allNews.flat(), loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch Indian news', loading: false });
    }
  },

  fetchGlobalNews: async () => {
    set({ loading: true, error: null });
    try {
      const newsPromises = NEWS_SOURCES.global.map(async (url) => {
        const response = await fetch(url);
        const text = await response.text();
        const feed = await rssParser.parse(text);
        return feed.items.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          published: item.published,
          link: item.links[0]?.url,
          imageUrl: item.enclosures?.[0]?.url,
          source: new URL(url).hostname,
        }));
      });

      const allNews = await Promise.all(newsPromises);
      set({ globalNews: allNews.flat(), loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch global news', loading: false });
    }
  },

  toggleBookmark: (item: NewsItem) => {
    const { bookmarks } = get();
    const isBookmarked = bookmarks.some((bookmark) => bookmark.id === item.id);
    
    if (isBookmarked) {
      set({ bookmarks: bookmarks.filter((bookmark) => bookmark.id !== item.id) });
    } else {
      set({ bookmarks: [...bookmarks, item] });
    }
  },
}));