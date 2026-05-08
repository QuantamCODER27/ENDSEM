import React from 'react';
import { ExternalLink, User, Calendar, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';

const NewsCard = ({ article, viewMode }) => {
  const { title, description, url, urlToImage, publishedAt, source, author, category } = article;
  
  const formattedDate = new Date(publishedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <motion.div 
      className={`news-card card ${viewMode === 'list' ? 'list-view' : ''}`}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
    >
      <div className="card-image">
        <img 
          src={urlToImage || 'https://images.unsplash.com/photo-1585829365234-781fcddec45a?auto=format&fit=crop&q=80&w=400'} 
          alt={title} 
          loading="lazy"
        />
        <div className="category-badge">{category}</div>
      </div>
      
      <div className="card-body">
        <div className="meta-info">
          <span className="source-badge">{source?.name || 'News'}</span>
          <span className="date"><Calendar size={12} /> {formattedDate}</span>
        </div>
        
        <h3 className="title">{title}</h3>
        
        <p className="description">
          {description?.length > 150 ? description.substring(0, 150) + '...' : description}
        </p>
        
        <div className="card-footer">
          {author && (
            <span className="author"><User size={12} /> {author.split(',')[0]}</span>
          )}
          <a href={url} target="_blank" rel="noopener noreferrer" className="read-more">
            Read More <ExternalLink size={14} />
          </a>
        </div>
      </div>

      <style jsx>{`
        .news-card {
          display: flex;
          flex-direction: column;
          padding: 0;
          overflow: hidden;
          height: 100%;
        }

        .news-card.list-view {
          flex-direction: row;
          height: 200px;
        }

        .card-image {
          position: relative;
          width: 100%;
          height: 200px;
        }

        .list-view .card-image {
          width: 280px;
          height: 100%;
        }

        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .category-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: var(--accent-primary);
          color: white;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .card-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .meta-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .source-badge {
          background: var(--accent-light);
          color: var(--accent-primary);
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 600;
        }

        .date {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .title {
          font-size: 1.1rem;
          margin-bottom: 12px;
          line-height: 1.4;
          color: var(--text-primary);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .description {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 20px;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 12px;
          border-top: 1px solid var(--border-color);
        }

        .author {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          color: var(--text-muted);
          max-width: 150px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .read-more {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--accent-primary);
          font-weight: 600;
          font-size: 0.85rem;
        }

        .read-more:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .news-card.list-view {
            flex-direction: column;
            height: auto;
          }
          .list-view .card-image {
            width: 100%;
            height: 200px;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default NewsCard;
