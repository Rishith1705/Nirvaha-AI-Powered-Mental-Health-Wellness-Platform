import React, { useState, useEffect, useRef } from 'react';

const TECHNIQUES = {
  box: {
    name: "Box Breathing (Sama Vritti)",
    desc: "A powerful stress reliever used to calm the nervous system, clear the mind, and increase concentration.",
    phases: [
      { name: "Inhale", duration: 4, action: "expand" },
      { name: "Hold", duration: 4, action: "stay-large" },
      { name: "Exhale", duration: 4, action: "contract" },
      { name: "Hold (Empty)", duration: 4, action: "stay-small" }
    ]
  },
  anulom: {
    name: "Anulom Vilom (Alternate Nostril)",
    desc: "Purifies energy channels (Nadis), balances the left and right hemispheres of the brain, and reduces anxiety.",
    phases: [
      { name: "Inhale (Left)", duration: 4, action: "expand" },
      { name: "Hold", duration: 4, action: "stay-large" },
      { name: "Exhale (Right)", duration: 4, action: "contract" },
      { name: "Inhale (Right)", duration: 4, action: "expand" },
      { name: "Hold", duration: 4, action: "stay-large" },
      { name: "Exhale (Left)", duration: 4, action: "contract" }
    ]
  },
  kapalbhati: {
    name: "Kapalbhati (Breath of Fire)",
    desc: "A rapid, energizing detox breath. Clears respiratory passages, sparks digestion, and awakens mental stamina.",
    phases: [
      { name: "Exhale (Sharp)", duration: 1.5, action: "contract" },
      { name: "Inhale (Passive)", duration: 1.5, action: "expand" }
    ]
  }
};

const AMBIENT_TRACKS = [
  { id: 1, name: "Vedic Om Chant (432Hz)", type: "Chant" },
  { id: 2, name: "Tibetan Singing Bowls", type: "Bowls" },
  { id: 3, name: "Himalayan Forest Rain & Flute", type: "Nature" },
  { id: 4, name: "Morning Sitar Meditation", type: "Sitar" }
];

export default function Pranayama() {
  const [selectedTech, setSelectedTech] = useState("box");
  const [isActive, setIsActive] = useState(false);
  const [currentPhaseIdx, setCurrentPhaseIdx] = useState(0);
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(TECHNIQUES.box.phases[0].duration);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(300); // 5 mins in seconds
  const [totalSelectedMinutes, setTotalSelectedMinutes] = useState(5);
  
  // Ambient Sound State
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(AMBIENT_TRACKS[0]);
  const [volume, setVolume] = useState(50);
  
  const timerRef = useRef(null);
  const breathingIntervalRef = useRef(null);

  const techInfo = TECHNIQUES[selectedTech];
  const currentPhase = techInfo.phases[currentPhaseIdx];

  // Handle technique change
  const handleTechChange = (tech) => {
    setSelectedTech(tech);
    setIsActive(false);
    setCurrentPhaseIdx(0);
    setPhaseSecondsLeft(TECHNIQUES[tech].phases[0].duration);
    setSessionTimeLeft(totalSelectedMinutes * 60);
  };

  // Set session length
  const handleSetMinutes = (mins) => {
    setTotalSelectedMinutes(mins);
    setSessionTimeLeft(mins * 60);
    setIsActive(false);
    setCurrentPhaseIdx(0);
    setPhaseSecondsLeft(TECHNIQUES[selectedTech].phases[0].duration);
  };

  // Start / Pause Session
  const toggleSession = () => {
    setIsActive(!isActive);
  };

  // Reset Session
  const resetSession = () => {
    setIsActive(false);
    setCurrentPhaseIdx(0);
    setPhaseSecondsLeft(techInfo.phases[0].duration);
    setSessionTimeLeft(totalSelectedMinutes * 60);
  };

  // Timers and Animation Loop
  useEffect(() => {
    if (isActive) {
      // 1. Session Timer
      timerRef.current = setInterval(() => {
        setSessionTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            clearInterval(breathingIntervalRef.current);
            setIsActive(false);
            alert("Sadhana session completed. Take a moment to sit in silence.");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // 2. Breathing Phase Timer (updates every 100ms for smooth sub-second steps like in Kapalbhati)
      const tickRate = 100; // ms
      let elapsedMs = 0;
      
      breathingIntervalRef.current = setInterval(() => {
        elapsedMs += tickRate;
        if (elapsedMs >= 1000) {
          elapsedMs = 0;
          setPhaseSecondsLeft((prev) => {
            if (prev <= 1) {
              // Transition to next phase
              setCurrentPhaseIdx((prevIdx) => {
                const nextIdx = (prevIdx + 1) % techInfo.phases.length;
                setPhaseSecondsLeft(techInfo.phases[nextIdx].duration);
                return nextIdx;
              });
              return 0; // Temp placeholder, gets reset on line above
            }
            return prev - 1;
          });
        }
      }, tickRate);
    } else {
      clearInterval(timerRef.current);
      clearInterval(breathingIntervalRef.current);
    }

    return () => {
      clearInterval(timerRef.current);
      clearInterval(breathingIntervalRef.current);
    };
  }, [isActive, selectedTech, currentPhaseIdx]);

  // Format MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Determine breathing ring scale based on active phase
  let ringScale = 1.0;
  let ringColor = 'var(--color-emerald)';
  let glowOpacity = 0.2;

  if (isActive) {
    const action = currentPhase.action;
    const duration = currentPhase.duration;
    const progress = (duration - phaseSecondsLeft) / duration; // 0 to 1

    if (action === 'expand') {
      ringScale = 0.95 + progress * 0.4; // 0.95 to 1.35
      glowOpacity = 0.1 + progress * 0.4;
    } else if (action === 'contract') {
      ringScale = 1.35 - progress * 0.4; // 1.35 to 0.95
      glowOpacity = 0.5 - progress * 0.4;
    } else if (action === 'stay-large') {
      ringScale = 1.35;
      ringColor = 'var(--color-saffron)';
      glowOpacity = 0.5;
    } else if (action === 'stay-small') {
      ringScale = 0.95;
      ringColor = 'var(--color-indigo)';
      glowOpacity = 0.1;
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="section-header">
        <h1 className="section-title">Pranayama Breathing Space</h1>
        <p className="section-subtitle">Regulate your vital life force (*Prana*) through traditional Vedic breathing exercises to harmonize mind and body.</p>
      </div>

      <div className="pranayama-layout">
        {/* Left Side: Breathing Animator */}
        <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div className="meditation-circle-container">
            {/* Ambient Ember particles floating when session is active */}
            {isActive && Array.from({ length: 8 }).map((_, i) => (
              <div 
                key={i}
                className="ember"
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: `${15 + Math.random() * 70}%`,
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--color-saffron)',
                  animation: `floatEmbers ${3 + Math.random() * 3}s linear infinite`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}

            <div 
              className="breathing-ring" 
              style={{ 
                transform: `scale(${ringScale})`, 
                borderColor: ringColor,
                boxShadow: `0 0 ${20 + glowOpacity * 30}px ${ringColor}`
              }}
            >
              <div className="breathing-ring-glow" style={{ background: ringColor, opacity: glowOpacity }}></div>
              <span className="breathing-text" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                {isActive ? currentPhase.name : "Ready"}
              </span>
              <span className="breathing-timer">
                {isActive ? `${Math.ceil(phaseSecondsLeft)}s` : "0s"}
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'center', margin: '24px 0 12px' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>
              {formatTime(sessionTimeLeft)}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Remaining Session Time
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button className={isActive ? "btn-outline" : "btn-saffron"} onClick={toggleSession}>
              {isActive ? "Pause Sadhana" : "Begin Sadhana"}
            </button>
            <button className="btn-outline" onClick={resetSession}>
              Reset
            </button>
          </div>
        </div>

        {/* Right Side: Setup and Sounds */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Technique Picker */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h2 className="chart-title">1. Select Breathing Practice</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
              {Object.keys(TECHNIQUES).map((key) => (
                <button
                  key={key}
                  className={`option-btn ${selectedTech === key ? 'selected' : ''}`}
                  onClick={() => handleTechChange(key)}
                  style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
                >
                  <span style={{ fontWeight: '600', fontSize: '15px' }}>{TECHNIQUES[key].name}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{TECHNIQUES[key].desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Settings & Sound */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h2 className="chart-title">2. Timer & Audio Environment</h2>
            
            <div style={{ margin: '16px 0' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Duration:</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[2, 5, 10, 15].map((mins) => (
                  <button 
                    key={mins} 
                    className={`btn-outline ${totalSelectedMinutes === mins ? 'active' : ''}`}
                    onClick={() => handleSetMinutes(mins)}
                    style={{ 
                      flexGrow: 1, 
                      padding: '8px 4px', 
                      fontSize: '13px',
                      background: totalSelectedMinutes === mins ? 'rgba(255, 153, 51, 0.1)' : '',
                      borderColor: totalSelectedMinutes === mins ? 'var(--color-saffron)' : ''
                    }}
                  >
                    {mins} Min
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Panel */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '16px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Ambient Sound:</div>
              
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600' }}>{selectedTrack.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{selectedTrack.type}</div>
                  </div>
                  <button 
                    onClick={() => setIsPlayingSound(!isPlayingSound)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: isPlayingSound ? 'var(--color-emerald)' : 'rgba(255,255,255,0.08)',
                      border: 'none',
                      color: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      boxShadow: isPlayingSound ? '0 0 10px rgba(16, 185, 129, 0.4)' : ''
                    }}
                  >
                    {isPlayingSound ? "⏸" : "▶"}
                  </button>
                </div>

                {/* Animated waves when playing */}
                {isPlayingSound && (
                  <div style={{ display: 'flex', gap: '3px', alignItems: 'center', height: '14px', marginTop: '10px' }}>
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div 
                        key={i} 
                        style={{
                          width: '2px',
                          background: 'var(--color-emerald)',
                          borderRadius: '1px',
                          height: `${4 + Math.random() * 10}px`,
                          animation: 'bounce 0.8s ease infinite alternate',
                          animationDelay: `${i * 0.05}s`
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {AMBIENT_TRACKS.map((track) => (
                  <button 
                    key={track.id} 
                    className="suggested-btn"
                    onClick={() => setSelectedTrack(track)}
                    style={{ 
                      fontSize: '11px',
                      borderColor: selectedTrack.id === track.id ? 'var(--color-indigo)' : '',
                      background: selectedTrack.id === track.id ? 'rgba(99, 102, 241, 0.1)' : ''
                    }}
                  >
                    {track.name.split(' (')[0]}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
