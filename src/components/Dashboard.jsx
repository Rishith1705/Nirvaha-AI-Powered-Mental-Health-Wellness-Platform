import React, { useState } from 'react';

const QUOTES = [
  { text: "A person is made by their belief. As they believe, so they are.", author: "Bhagavad Gita" },
  { text: "You are what your deep, driving desire is. As your desire is, so is your will. As your will is, so is your deed. As your deed is, so is your destiny.", author: "Brihadaranyaka Upanishad" },
  { text: "When breathing is deep, the mind is steady; when breathing is irregular, the mind is unstable. Therefore, one should regulate the breath.", author: "Hatha Yoga Pradipika" },
  { text: "The mind indeed is the cause of bondage and liberation for human beings.", author: "Maitri Upanishad" }
];

const MOODS = [
  { val: 1, emoji: "😢", label: "Anxious" },
  { val: 2, emoji: "😔", label: "Restless" },
  { val: 3, emoji: "😐", label: "Centered" },
  { val: 4, emoji: "😊", label: "Joyful" },
  { val: 5, emoji: "😇", label: "Blissful" }
];

export default function Dashboard({ userDosha, onNavigate, wellnessLogs = [], onLogWellness }) {
  const [sadhanaItems, setSadhanaItems] = useState([
    { id: 1, text: "Ushapan (Drink warm water upon waking)", category: "body", completed: false },
    { id: 2, text: "10 mins Pranayama (Alternate Nostril Breathing)", category: "mind", completed: false },
    { id: 3, text: "15 mins Surya Namaskar (Sun Salutations)", category: "body", completed: false },
    { id: 4, text: "Ahamsodha (10 mins midday silent reflection)", category: "mind", completed: false },
    { id: 5, text: "Ahar (Warm cooked lunch matching your Dosha)", category: "body", completed: false },
    { id: 6, text: "Swadhyaya (Read ancient scripture or philosophy)", category: "spirit", completed: false }
  ]);

  // Current Check-in State
  const [selectedMood, setSelectedMood] = useState(null);
  const [sleepHours, setSleepHours] = useState(7);
  const [medMins, setMedMins] = useState(10);
  const [isLoggedToday, setIsLoggedToday] = useState(false);

  // Dynamic Greeting based on time of day
  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return { sanskrit: "Subhodayam", English: "Good Morning" };
    if (hr < 17) return { sanskrit: "Subhamadhyahnam", English: "Good Afternoon" };
    return { sanskrit: "Subhasandhya", English: "Good Evening" };
  };

  const greeting = getGreeting();
  
  // Rotating Quote based on current date
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 1)) / 86400000);
  const quote = QUOTES[dayOfYear % QUOTES.length];

  // Toggle checklist items
  const toggleSadhana = (id) => {
    setSadhanaItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, completed: !item.completed };
      }
      return item;
    }));
  };

  // Submit Daily check-in
  const handleCheckInSubmit = () => {
    if (selectedMood === null) return;
    
    if (onLogWellness) {
      onLogWellness({
        timestamp: new Date().toISOString(),
        mood: selectedMood,
        sleepHours: parseFloat(sleepHours),
        meditationMinutes: parseInt(medMins)
      });
    }

    setIsLoggedToday(true);
  };

  // Completed Count
  const completedSadhanaCount = sadhanaItems.filter(item => item.completed).length;

  return (
    <div className="animate-fade-in">
      <div className="section-header">
        <h1 className="section-title" style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
          <span style={{ fontSize: '20px', fontWeight: '500', color: 'var(--color-saffron)', fontFamily: 'monospace' }}>
            {greeting.sanskrit}
          </span>
          <span>{greeting.English}, Sadhaka</span>
        </h1>
        <p className="section-subtitle">Welcome back to your spiritual sanctuary. Here is your daily path to balance.</p>
      </div>

      {/* Quote Banner */}
      <div className="quote-banner">
        <p className="quote-text">“{quote.text}”</p>
        <span className="quote-author">— {quote.author}</span>
      </div>

      <div className="dashboard-grid">
        {/* Left Side: Daily Practices */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Sadhana Checklist */}
          <div className="glass-panel dashboard-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Nitya Sadhana Practices</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Rituals designed to nurture your Mind, Body, and Spirit.
                </p>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--color-saffron)', fontWeight: '600', background: 'var(--color-saffron-glow)', padding: '4px 10px', borderRadius: '12px' }}>
                {completedSadhanaCount} / {sadhanaItems.length} Done
              </div>
            </div>

            <div className="sadhana-list">
              {sadhanaItems.map((item) => (
                <div 
                  key={item.id} 
                  className={`sadhana-item ${item.completed ? 'completed' : ''}`}
                  onClick={() => toggleSadhana(item.id)}
                >
                  <div className="checkbox-custom">
                    <svg viewBox="0 0 24 24">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <div className="sadhana-text">{item.text}</div>
                  <span className={`sadhana-tag tag-${item.category}`}>{item.category}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dosha Customized Advice Box */}
          <div className="glass-panel dashboard-card" style={{ borderLeft: '4px solid var(--color-emerald)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-emerald)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🌱 Ayurvedic Recommendation
            </h2>
            {userDosha ? (
              <div style={{ marginTop: '12px' }}>
                <p style={{ fontSize: '14px', color: '#fff', fontWeight: '500' }}>
                  Insights for your <strong style={{ color: 'var(--color-saffron)' }}>{userDosha}</strong> constitution today:
                </p>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: '1.5' }}>
                  {userDosha === 'Vata' && "Since your constitution is dominated by Air & Ether, avoid dry cold crackers or salads this afternoon. Opt for a warm cup of spiced vegetable soup to ground your focus and soothe any anxious energy."}
                  {userDosha === 'Pitta' && "With the fiery Pitta element dominant, avoid overly spicy or salty meals for lunch. Enjoy a sweet mango or refresh with coconut water to keep hyper-acidity and impatience at bay."}
                  {userDosha === 'Kapha' && "To offset Kapha sluggishness, perform 10 minutes of active breathwork before your midday meal. Eat light, warm, and highly spiced foods, and avoid heavy dairy or cold beverages."}
                </p>
              </div>
            ) : (
              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '400px' }}>
                  You have not completed your Prakriti Analysis yet. Take the 10-question evaluation to unlock tailored Ayurvedic dietary, physical, and wellness guides!
                </p>
                <button className="btn-saffron" onClick={() => onNavigate('quiz')} style={{ padding: '8px 16px', fontSize: '13px' }}>
                  Start Analysis
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Check-in Logs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Daily Wellness Logger */}
          <div className="glass-panel dashboard-card">
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Daily Check-In</h2>
            
            {isLoggedToday ? (
              <div style={{ textAlign: 'center', padding: '32px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '48px' }}>😇</span>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-emerald)' }}>Log Saved for Today</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Your alignment data has been written to the Akashic Records (local storage). Check the **Sadhana Analytics** tab to view your progress.
                </p>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Record your current state to monitor your path to balance over time.
                </p>

                {/* Mood buttons */}
                <div style={{ marginTop: '16px' }}>
                  <div style={{ fontSize: '13px', color: '#fff', fontWeight: '500', marginBottom: '8px' }}>Current Mood:</div>
                  <div className="checkin-row">
                    {MOODS.map((m) => (
                      <button 
                        key={m.val} 
                        className={`checkin-btn ${selectedMood === m.val ? 'active' : ''}`}
                        onClick={() => setSelectedMood(m.val)}
                      >
                        <span className="checkin-icon">{m.emoji}</span>
                        <span className="checkin-label">{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sliders */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                      <span>Sleep last night:</span>
                      <strong style={{ color: 'var(--color-indigo)' }}>{sleepHours} hrs</strong>
                    </div>
                    <input 
                      type="range" 
                      min="4" 
                      max="12" 
                      step="0.5" 
                      value={sleepHours}
                      onChange={(e) => setSleepHours(e.target.value)}
                      style={{ width: '100%', accentColor: 'var(--color-indigo)' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                      <span>Meditation / Pranayama:</span>
                      <strong style={{ color: 'var(--color-emerald)' }}>{medMins} mins</strong>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="60" 
                      step="5" 
                      value={medMins}
                      onChange={(e) => setMedMins(e.target.value)}
                      style={{ width: '100%', accentColor: 'var(--color-emerald)' }}
                    />
                  </div>
                </div>

                <button 
                  className="btn-primary" 
                  onClick={handleCheckInSubmit} 
                  disabled={selectedMood === null}
                  style={{ width: '100%', marginTop: '24px', justifyContent: 'center' }}
                >
                  Save Check-In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
