import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, SlideInUp, SlideOutDown } from 'react-native-reanimated';
import { Send, X } from 'lucide-react-native';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface AIChatModalProps {
  isVisible: boolean;
  onClose: () => void;
  articleContent: {
    title: string;
    description: string;
  };
}

const genAI = new GoogleGenerativeAI('YOUR_API_KEY');

export default function AIChatModal({ isVisible, onClose, articleContent }: AIChatModalProps) {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'ai'; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    setMessage('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = `Article Title: ${articleContent.title}\nArticle Content: ${articleContent.description}\n\nUser Question: ${userMessage}`;
      
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      setChatHistory(prev => [...prev, { role: 'ai', content: text }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <Animated.View 
      entering={FadeIn}
      style={StyleSheet.absoluteFill}
    >
      <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill}>
        <Animated.View 
          entering={SlideInUp}
          exiting={SlideOutDown}
          style={styles.modalContainer}
        >
          <View style={styles.header}>
            <Text style={styles.title}>AI Chat Assistant</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X color="#FFFFFF" size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.chatContainer}>
            <Text style={styles.articleTitle}>{articleContent.title}</Text>
            {chatHistory.map((msg, index) => (
              <View
                key={index}
                style={[
                  styles.messageContainer,
                  msg.role === 'user' ? styles.userMessage : styles.aiMessage,
                ]}
              >
                <Text style={styles.messageText}>{msg.content}</Text>
              </View>
            ))}
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#007AFF" />
              </View>
            )}
          </ScrollView>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Ask about the article..."
              placeholderTextColor="#8E8E93"
              multiline
            />
            <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
              <Send color="#FFFFFF" size={20} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 44 : 0,
    backgroundColor: 'rgba(28, 28, 30, 0.9)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#38383A',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 8,
  },
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  articleTitle: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  messageContainer: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  aiMessage: {
    backgroundColor: '#38383A',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#38383A',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#38383A',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    color: '#FFFFFF',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});