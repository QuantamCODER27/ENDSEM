import React from 'react';
import { useData } from '../../context/DataContext';
import { Users, User } from 'lucide-react';

const AstronautsInfo = () => {
  const { issData } = useData();
  const { astronauts } = issData;

  return (
    <div className="card astronauts-card">
      <div className="card-header">
        <Users size={20} className="text-accent" />
        <h3>People in Space</h3>
        <span className="badge badge-success">{astronauts.length} Total</span>
      </div>

      <div className="astronaut-list">
        {astronauts.length > 0 ? (
          astronauts.map((person, index) => (
            <div key={index} className="astronaut-item">
              <div className="avatar">
                <User size={16} />
              </div>
              <div className="info">
                <p className="name">{person.name}</p>
                <p className="craft">{person.craft}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-msg">No astronaut data available</p>
        )}
      </div>

      <style jsx>{`
        .astronauts-card {
          max-height: 400px;
          display: flex;
          flex-direction: column;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .card-header h3 {
          flex: 1;
          font-size: 1.1rem;
        }

        .astronaut-list {
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-right: 8px;
        }

        .astronaut-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          border-radius: 10px;
          background: var(--bg-tertiary);
          transition: transform 0.2s ease;
        }

        .astronaut-item:hover {
          transform: translateX(5px);
          background: var(--accent-light);
        }

        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--accent-primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .name {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .craft {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .empty-msg {
          text-align: center;
          color: var(--text-muted);
          padding: 20px;
        }
      `}</style>
    </div>
  );
};

export default AstronautsInfo;
