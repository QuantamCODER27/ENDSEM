import React from 'react';
import { useData } from '../../context/DataContext';
import ISSMap from './ISSMap';
import ISSStats from './ISSStats';
import AstronautsInfo from './AstronautsInfo';
import ISSSpeedChart from '../charts/ISSSpeedChart';
import { motion } from 'framer-motion';
import { RefreshCcw } from 'lucide-react';

const ISSDashboard = () => {
  const { issData, fetchISS } = useData();

  return (
    <div className="iss-dashboard">
      <header className="dashboard-header">
        <h2 className="section-title">
          <RefreshCcw className={issData.loading ? 'animate-spin' : ''} size={24} onClick={fetchISS} />
          ISS Live Tracker
        </h2>
      </header>

      <div className="dashboard-grid">
        <div className="grid-left">
          <motion.div 
            className="card map-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <ISSMap />
          </motion.div>
          
          <div className="stats-row">
            <ISSStats />
          </div>
        </div>

        <div className="grid-right">
          <AstronautsInfo />
          <div className="card chart-card">
            <h3>Speed Trend (km/h)</h3>
            <ISSSpeedChart />
          </div>
        </div>
      </div>

      <style jsx>{`
        .iss-dashboard {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }

        .grid-left {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .grid-right {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .map-card {
          height: 500px;
          padding: 0;
          overflow: hidden;
          position: relative;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .chart-card {
          flex: 1;
          min-height: 300px;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1200px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ISSDashboard;
