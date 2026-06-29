import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import DoshaQuiz from './components/DoshaQuiz';
import SadhanaChat from './components/SadhanaChat';
import Pranayama from './components/Pranayama';
import WisdomLibrary from './components/WisdomLibrary';
import Analytics from './components/Analytics';
import Login from './components/Login';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [userDosha, setUserDosha] = useState('');
  const [doshaPct, setDoshaPct] = useState({ Vata: 0, Pitta: 0, Kapha: 0 });
  const [wellnessLogs, setWellnessLogs] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('nirvaha_user');
    const savedDosha = localStorage.getItem('nirvaha_dosha') || '';
    const savedPct = localStorage.getItem('nirvaha_dosha_pct');
    const savedLogs = localStorage.getItem('nirvaha_wellness_logs');
    const savedBookmarks = localStorage.getItem('nirvaha_bookmarks');

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedDosha) setUserDosha(savedDosha);
    if (savedPct) setDoshaPct(JSON.parse(savedPct));
    if (savedLogs) setWellnessLogs(JSON.parse(savedLogs));
    if (savedBookmarks) setBookmarkedIds(JSON.parse(savedBookmarks));
  }, []);

  // Handle Login session
  const handleLogin = (userProfile) => {
    setUser(userProfile);
    localStorage.setItem('nirvaha_user', JSON.stringify(userProfile));
  };

  // Handle Logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('nirvaha_user');
  };

  // Save Dosha results
  const handleSaveDosha = (dosha, percentages) => {
    setUserDosha(dosha);
    setDoshaPct(percentages);
    localStorage.setItem('nirvaha_dosha', dosha);
    localStorage.setItem('nirvaha_dosha_pct', JSON.stringify(percentages));
  };

  // Add a new daily check-in log
  const handleLogWellness = (newLog) => {
    const updated = [...wellnessLogs, newLog];
    setWellnessLogs(updated);
    localStorage.setItem('nirvaha_wellness_logs', JSON.stringify(updated));
  };

  // Toggle Bookmark
  const handleToggleBookmark = (id) => {
    let updated;
    if (bookmarkedIds.includes(id)) {
      updated = bookmarkedIds.filter(bId => bId !== id);
    } else {
      updated = [...bookmarkedIds, id];
    }
    setBookmarkedIds(updated);
    localStorage.setItem('nirvaha_bookmarks', JSON.stringify(updated));
  };

  // Nav helper
  const handleNavigate = (tab) => {
    setActiveTab(tab);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">N</div>
          <h1 className="brand-name">Nirvaha</h1>
        </div>

        <nav>
          <ul className="nav-links">
            <li className="nav-item">
              <button 
                className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleNavigate('dashboard')}
              >
                <span className="nav-icon">🕉</span>
                <span>Sadhana Mandiram</span>
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-button ${activeTab === 'quiz' ? 'active' : ''}`}
                onClick={() => handleNavigate('quiz')}
              >
                <span className="nav-icon">🧬</span>
                <span>Prakriti Pareeksha</span>
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-button ${activeTab === 'chat' ? 'active' : ''}`}
                onClick={() => handleNavigate('chat')}
              >
                <span className="nav-icon">💬</span>
                <span>Sadhana Guru AI</span>
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-button ${activeTab === 'pranayama' ? 'active' : ''}`}
                onClick={() => handleNavigate('pranayama')}
              >
                <span className="nav-icon">🧘</span>
                <span>Prana Shala</span>
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-button ${activeTab === 'library' ? 'active' : ''}`}
                onClick={() => handleNavigate('library')}
              >
                <span className="nav-icon">📚</span>
                <span>Gnana Bhandaram</span>
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-button ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => handleNavigate('analytics')}
              >
                <span className="nav-icon">📊</span>
                <span>Sadhana Pragati</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* User Status Widget */}
        <div className="user-status-widget" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '16px' }}>👤</span>
            <span style={{ fontWeight: '600', fontSize: '14px', color: '#fff' }}>{user.name}</span>
          </div>
          
          <div>
            <div className="widget-title">Prakriti Status</div>
            <div className="widget-dosha" style={{ marginBottom: '8px' }}>
              {userDosha ? (
                <>
                  <span className="badge-circle glow-orange" style={{ background: 'var(--color-saffron)' }}></span>
                  <span>{userDosha} Type</span>
                </>
              ) : (
                <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: 'normal' }}>
                  Undetermined
                </span>
              )}
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            style={{
              width: '100%',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '8px',
              color: '#f87171',
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
              transition: 'all 0.2s',
              fontFamily: 'var(--font-heading)'
            }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Viewport Panel */}
      <main className="main-viewport">
        {activeTab === 'dashboard' && (
          <Dashboard 
            userDosha={userDosha}
            onNavigate={handleNavigate}
            wellnessLogs={wellnessLogs}
            onLogWellness={handleLogWellness}
          />
        )}
        
        {activeTab === 'quiz' && (
          <DoshaQuiz 
            currentDosha={userDosha}
            onSaveDosha={handleSaveDosha}
          />
        )}
        
        {activeTab === 'chat' && (
          <SadhanaChat 
            userDosha={userDosha}
          />
        )}
        
        {activeTab === 'pranayama' && (
          <Pranayama />
        )}
        
        {activeTab === 'library' && (
          <WisdomLibrary 
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
          />
        )}
        
        {activeTab === 'analytics' && (
          <Analytics 
            wellnessLogs={wellnessLogs}
          />
        )}
      </main>
    </div>
  );
}

