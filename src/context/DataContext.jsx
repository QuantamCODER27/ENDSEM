import React, { createContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';

export const DataContext = createContext();

// Haversine distance in km
const haversine = (lat1, lon1, lat2, lon2) => {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const DataProvider = ({ children }) => {
  // ----- ISS STATE -----
  const [issData, setIssData] = useState({
    location: null, // { lat, lng, timestamp }
    history: [],   // last 30 positions
    speed: 0,
    nearestPlace: 'Fetching... ',
    astronauts: [],
    loading: true,
    error: null,
  });

  // ----- NEWS STATE -----
  const [newsData, setNewsData] = useState({
    articles: [],
    categories: [],
    loading: true,
    error: null,
    lastFetched: null,
  });

  // ------- ISS HELPERS -------
  const fetchNearestPlace = async (lat, lng) => {
    try {
      const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const place = res.data.display_name || 'Over the Ocean';
      setIssData(prev => ({ ...prev, nearestPlace: place }));
    } catch {
      setIssData(prev => ({ ...prev, nearestPlace: 'International Waters' }));
    }
  };

  const fetchISS = useCallback(async () => {
    try {
      const response = await axios.get('http://api.open-notify.org/iss-now.json');
      const { latitude, longitude } = response.data.iss_position;
      const timestamp = response.data.timestamp;
      const newPos = { lat: parseFloat(latitude), lng: parseFloat(longitude), timestamp };

      setIssData(prev => {
        const newHistory = [...prev.history, newPos].slice(-30);
        let newSpeed = prev.speed;
        if (prev.history.length > 0) {
          const last = prev.history[prev.history.length - 1];
          const dist = haversine(last.lat, last.lng, newPos.lat, newPos.lng);
          const hrs = (newPos.timestamp - last.timestamp) / 3600;
          if (hrs > 0) newSpeed = Math.round(dist / hrs);
        }
        return {
          ...prev,
          location: newPos,
          history: newHistory,
          speed: newSpeed || 27600,
          loading: false,
          error: null,
        };
      });

      fetchNearestPlace(newPos.lat, newPos.lng);
    } catch (err) {
      setIssData(prev => ({ ...prev, error: 'Failed to fetch ISS location', loading: false }));
    }
  }, []);

  const fetchAstronauts = useCallback(async () => {
    try {
      const response = await axios.get('http://api.open-notify.org/astros.json');
      setIssData(prev => ({ ...prev, astronauts: response.data.people }));
    } catch (err) {
      console.error('Astronauts fetch error', err);
    }
  }, []);

  // ------- NEWS HELPERS -------
  const fetchNews = useCallback(async (force = false) => {
    const cached = localStorage.getItem('news_cache');
    const cacheTime = Number(localStorage.getItem('news_cache_time'));
    const now = Date.now();
    
    if (!force && cached && cacheTime && now - cacheTime < 15 * 60 * 1000) {
      const parsed = JSON.parse(cached);
      setNewsData(prev => ({
        ...prev,
        articles: parsed,
        categories: Array.from(new Set(parsed.map(a => a.category || 'general'))),
        loading: false,
        lastFetched: cacheTime,
      }));
      return;
    }

    setNewsData(prev => ({ ...prev, loading: true }));
    
    try {
      const apiKey = import.meta.env.VITE_NEWS_API_KEY;
      // NewsData.io supports multiple categories in one request
      const categories = ['technology', 'science'];
      const response = await axios.get(`https://newsdata.io/api/1/news?apikey=${apiKey}&category=${categories.join(',')}&language=en`);
      
      const articles = response.data.results.map(article => ({
        title: article.title,
        description: article.description,
        url: article.link,
        urlToImage: article.image_url,
        publishedAt: article.pubDate,
        source: { name: article.source_id },
        category: article.category ? article.category[0] : 'general'
      }));

      setNewsData({
        articles,
        categories,
        loading: false,
        error: null,
        lastFetched: now,
      });
      
      localStorage.setItem('news_cache', JSON.stringify(articles));
      localStorage.setItem('news_cache_time', now.toString());
    } catch (err) {
      console.error('News fetch error:', err);
      setNewsData(prev => ({ ...prev, error: 'Failed to fetch news', loading: false }));
    }
  }, []);

  // ------- INITIAL FETCH & INTERVALS -------
  useEffect(() => {
    fetchISS();
    fetchAstronauts();
    fetchNews();
    const issInterval = setInterval(fetchISS, 15000);
    const astroInterval = setInterval(fetchAstronauts, 60000);
    return () => {
      clearInterval(issInterval);
      clearInterval(astroInterval);
    };
  }, [fetchISS, fetchAstronauts, fetchNews]);

  return (
    <DataContext.Provider value={{ issData, newsData, fetchISS, fetchNews }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => React.useContext(DataContext);
