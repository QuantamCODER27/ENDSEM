import React, { useState } from 'react';
import { LayoutDashboard, Newspaper, Map as MapIcon, MessageSquare, Sun, Moon, Rocket, Menu, X } from 'lucide-react';
import ISSDashboard from './features/iss/ISSDashboard';
import NewsDashboard from './features/news/NewsDashboard';
import Chatbot from './features/chatbot/Chatbot';
import { useTheme } from './context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('iss');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { id: 'iss', label: 'ISS Tracker', icon: <MapIcon size={20} /> },
    { id: 'news', label: 'News Feed', icon: <Newspaper size={20} /> },
  ];

  return (
    <div className="app-container">
      {/* Mobile Header */}
      <header className="mobile-header glass">
        <button onClick={() => setIsSidebarOpen(true)}>
          <Menu size={24} />
        </button>
        <div className="logo flex-center">
          <Rocket className="text-accent" size={24} />
          <span>AstroDash</span>
        </div>
        <button onClick={toggleTheme}>
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`sidebar glass ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo flex-center">
            <Rocket className="text-accent" size={28} />
            <h1>AstroDash</h1>
          </div>
          <button className="mobile-only" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? (
              <><Moon size={20} /> Dark Mode</>
            ) : (
              <><Sun size={20} /> Light Mode</>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'iss' ? <ISSDashboard /> : <NewsDashboard />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Chatbot Overlay */}
      <Chatbot />

      <style jsx>{`
        .app-container {
          display: flex;
          min-height: 100vh;
          background-color: var(--bg-primary);
        }

        .mobile-header {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 64px;
          padding: 0 20px;
          justify-content: space-between;
          align-items: center;
          z-index: 100;
        }

        .sidebar {
          width: 280px;
          height: 100vh;
          position: sticky;
          top: 0;
          display: flex;
          flex-direction: column;
          padding: 32px 24px;
          border-right: 1px solid var(--border-color);
        }

        .sidebar-header {
          margin-bottom: 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          gap: 12px;
          color: var(--accent-primary);
        }

        .logo h1 {
          font-size: 1.5rem;
          color: var(--text-primary);
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          color: var(--text-secondary);
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .nav-item:hover {
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .nav-item.active {
          background-color: var(--accent-primary);
          color: white;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .sidebar-footer {
          margin-top: auto;
          padding-top: 24px;
          border-top: 1px solid var(--border-color);
        }

        .theme-toggle {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          width: 100%;
          border-radius: 12px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .theme-toggle:hover {
          background-color: var(--bg-tertiary);
        }

        .main-content {
          flex: 1;
          padding: 40px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .mobile-only {
          display: none;
        }

        @media (max-width: 1024px) {
          .app-container {
            flex-direction: column;
          }

          .mobile-header {
            display: flex;
          }

          .sidebar {
            position: fixed;
            left: -280px;
            z-index: 200;
            transition: left 0.3s ease;
            background: var(--bg-secondary);
          }

          .sidebar.open {
            left: 0;
          }

          .main-content {
            padding: 84px 20px 40px;
          }

          .mobile-only {
            display: block;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
