import { useState, useEffect, useCallback } from 'react';
import { openrouterChat } from '../lib/openrouterApi';
import { useData } from '../context/DataContext';

// HF token removed – using OpenRouter API
const MODEL_ID = 'gpt-4o-mini';

export const useChatbot = () => {
  const { issData, newsData } = useData();
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chat_history');
    return saved ? JSON.parse(saved) : [{ 
      role: 'assistant', 
      content: "Hello! I'm your AstroDash Assistant. I can answer questions about the ISS location, its speed, and the news articles currently on your dashboard." 
    }];
  });
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    localStorage.setItem('chat_history', JSON.stringify(messages.slice(-30)));
  }, [messages]);

  const generateContext = () => {
    const issContext = `
      ISS LOCATION: Latitude ${issData.location?.lat.toFixed(4)}, Longitude ${issData.location?.lng.toFixed(4)}.
      ISS SPEED: ${issData.speed} km/h.
      NEAREST PLACE: ${issData.nearestPlace}.
      ASTRONAUTS IN SPACE: Total ${issData.astronauts.length}. Names: ${issData.astronauts.map(a => a.name).join(', ')}.
    `;

    const newsContext = `
      TOTAL NEWS ARTICLES: ${newsData.articles.length}.
      NEWS CATEGORIES: ${newsData.categories.join(', ')}.
      LATEST HEADLINES:
      ${newsData.articles.map((a, i) => `${i+1}. ${a.title} (Source: ${a.source?.name}, Category: ${a.category})`).join('\n')}
    `;

    return `DASHBOARD DATA:\n${issContext}\n${newsContext}\n
    RULE: You are an AI assistant for AstroDash. You MUST ONLY answer based on the DASHBOARD DATA provided above. 
    If a user asks something not in the data, politely say you don't have that information and can only talk about the ISS or the current news.
    DO NOT use outside knowledge. Keep answers concise.`;
  };

  const sendMessage = async (content) => {
    const newUserMsg = { role: 'user', content };
    setMessages(prev => [...prev, newUserMsg]);
    setIsTyping(true);

    try {
      const context = generateContext();
      const response = await openrouterChat({
        model: MODEL_ID,
        messages: [{ role: 'user', content: `${context}\n\nUser Question: ${content}` }]
      });
      const botResponse = response.choices?.[0]?.message?.content || 'No response';
      setMessages(prev => [...prev, { role: 'assistant', content: botResponse }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I'm having trouble connecting to my brain right now. Please check your API key or try again later." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    const initialMsg = { role: 'assistant', content: "Chat cleared. How can I help you with the dashboard data?" };
    setMessages([initialMsg]);
    localStorage.removeItem('chat_history');
  };

  return { messages, sendMessage, isTyping, clearChat };
};
