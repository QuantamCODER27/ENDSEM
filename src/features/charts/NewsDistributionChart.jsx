import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useData } from '../../context/DataContext';

const NewsDistributionChart = ({ onSelectCategory, activeCategory }) => {
  const { newsData } = useData();
  
  // Count articles per category
  const dataMap = newsData.articles.reduce((acc, curr) => {
    const cat = curr.category || 'other';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const data = Object.keys(dataMap).map(key => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: dataMap[key],
    originalKey: key
  }));

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const handleClick = (entry) => {
    const key = entry.originalKey;
    if (activeCategory === key) {
      onSelectCategory('all');
    } else {
      onSelectCategory(key);
    }
  };

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            onClick={handleClick}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
                opacity={activeCategory === 'all' || activeCategory === entry.originalKey ? 1 : 0.3}
                style={{ cursor: 'pointer', transition: 'opacity 0.3s ease' }}
              />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--bg-secondary)', 
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
              borderRadius: '8px'
            }}
          />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
      <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '10px' }}>
        Click a slice to filter articles
      </p>
    </div>
  );
};

export default NewsDistributionChart;
