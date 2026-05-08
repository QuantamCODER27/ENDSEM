import React from 'react';
import { useData } from '../../context/DataContext';
import { Gauge, MapPin, Navigation, History } from 'lucide-react';

const ISSStats = () => {
  const { issData } = useData();
  const { location, speed, nearestPlace, history, isRateLimited } = issData;

  const displayPlace = (isRateLimited && nearestPlace.includes('Fetching')) 
    ? 'Rate Limited - Waiting...' 
    : nearestPlace;

  const stats = [
    {
      label: 'Latitude',
      value: location ? location.lat.toFixed(4) : '--',
      icon: <MapPin className="text-blue-500" />,
      color: '#3b82f6'
    },
    {
      label: 'Longitude',
      value: location ? location.lng.toFixed(4) : '--',
      icon: <Navigation className="text-emerald-500" />,
      color: '#10b981'
    },
    {
      label: 'Current Speed',
      value: `${speed.toLocaleString()} km/h`,
      icon: <Gauge className="text-orange-500" />,
      color: '#f59e0b'
    },
    {
      label: 'Positions Tracked',
      value: history.length,
      icon: <History className="text-purple-500" />,
      color: '#8b5cf6'
    }
  ];

  return (
    <>
      <div className="card location-card full-width">
        <div className="flex-center" style={{ gap: '12px', justifyContent: 'flex-start' }}>
          <div className="icon-box" style={{ background: 'var(--accent-light)' }}>
            <MapPin size={24} color="var(--accent-primary)" />
          </div>
          <div>
            <p className="label">Nearest Place / Ocean</p>
            <h3 className="value">{displayPlace}</h3>
          </div>
        </div>
      </div>

      {stats.map((stat, index) => (
        <div key={index} className="card stat-card">
          <div className="stat-icon" style={{ color: stat.color }}>
            {stat.icon}
          </div>
          <div className="stat-info">
            <p className="label">{stat.label}</p>
            <h3 className="value">{stat.value}</h3>
          </div>
        </div>
      ))}

      <style jsx>{`
        .stat-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
        }

        .location-card {
          grid-column: 1 / -1;
          padding: 20px;
        }

        .icon-box {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .label {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 4px;
        }

        .value {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .stat-icon {
          background: var(--bg-tertiary);
          padding: 12px;
          border-radius: 12px;
        }
      `}</style>
    </>
  );
};

export default ISSStats;
