import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import NewsCard from './NewsCard';
import NewsDistributionChart from '../charts/NewsDistributionChart';
import { Search, SortAsc, SortDesc, RefreshCcw, LayoutGrid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NewsDashboard = () => {
  const { newsData, fetchNews } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date' or 'source'
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredNews = useMemo(() => {
    let result = [...newsData.articles];

    // Category filter
    if (filterCategory !== 'all') {
      result = result.filter(a => a.category === filterCategory);
    }

    // Search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(a => 
        a.title?.toLowerCase().includes(lowerSearch) || 
        a.description?.toLowerCase().includes(lowerSearch) ||
        a.source?.name?.toLowerCase().includes(lowerSearch)
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = new Date(b.publishedAt) - new Date(a.publishedAt);
      } else if (sortBy === 'source') {
        comparison = (a.source?.name || '').localeCompare(b.source?.name || '');
      }
      return sortOrder === 'asc' ? -comparison : comparison;
    });

    return result;
  }, [newsData.articles, searchTerm, sortBy, sortOrder, filterCategory]);

  const toggleSortOrder = () => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');

  return (
    <div className="news-dashboard">
      <header className="dashboard-header">
        <h2 className="section-title">Latest Headlines</h2>
        <div className="header-actions">
          <div className="search-bar glass">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search news..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="refresh-btn card flex-center" onClick={() => fetchNews(true)}>
            <RefreshCcw size={18} className={newsData.loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      <div className="news-content-grid">
        <div className="news-main">
          <div className="filters-row card glass">
            <div className="filter-group">
              <button 
                className={`filter-chip ${filterCategory === 'all' ? 'active' : ''}`}
                onClick={() => setFilterCategory('all')}
              >
                All
              </button>
              {newsData.categories.map(cat => (
                <button 
                  key={cat}
                  className={`filter-chip ${filterCategory === cat ? 'active' : ''}`}
                  onClick={() => setFilterCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="sort-group">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                <option value="date">Sort by Date</option>
                <option value="source">Sort by Source</option>
              </select>
              <button className="sort-order-btn" onClick={toggleSortOrder}>
                {sortOrder === 'asc' ? <SortAsc size={20} /> : <SortDesc size={20} />}
              </button>
              <div className="view-toggle">
                <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}><LayoutGrid size={20} /></button>
                <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}><List size={20} /></button>
              </div>
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            <motion.div 
              className={`news-list ${viewMode}`}
              layout
            >
              {newsData.loading ? (
                Array(6).fill(0).map((_, i) => <div key={i} className="skeleton card" style={{ height: '300px' }}></div>)
              ) : filteredNews.length > 0 ? (
                filteredNews.map((article, index) => (
                  <NewsCard key={article.url || index} article={article} viewMode={viewMode} />
                ))
              ) : (
                <div className="empty-state">No articles found matching your criteria.</div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <aside className="news-sidebar">
          <div className="card distribution-card">
            <h3>News Distribution</h3>
            <NewsDistributionChart onSelectCategory={setFilterCategory} activeCategory={filterCategory} />
          </div>
        </aside>
      </div>

      <style jsx>{`
        .news-dashboard {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .search-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          border-radius: 12px;
          width: 300px;
        }

        .search-bar input {
          border: none;
          background: none;
          outline: none;
          color: var(--text-primary);
          width: 100%;
        }

        .news-content-grid {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 24px;
        }

        .filters-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 20px;
          margin-bottom: 24px;
          border-radius: 12px;
        }

        .filter-group {
          display: flex;
          gap: 8px;
        }

        .filter-chip {
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.85rem;
          background: var(--bg-tertiary);
          color: var(--text-secondary);
          transition: all 0.2s;
        }

        .filter-chip.active {
          background: var(--accent-primary);
          color: white;
        }

        .sort-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sort-select {
          background: none;
          border: 1px solid var(--border-color);
          padding: 6px 12px;
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 0.85rem;
        }

        .news-list.grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .news-list.list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .distribution-card {
          position: sticky;
          top: 40px;
        }

        .skeleton {
          background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--border-color) 50%, var(--bg-tertiary) 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
        }

        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @media (max-width: 1200px) {
          .news-content-grid {
            grid-template-columns: 1fr;
          }
          .news-sidebar {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default NewsDashboard;
