import React from 'react';

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MOOD_EMOJIS = {
  1: "😢",
  2: "😔",
  3: "😐",
  4: "😊",
  5: "😇"
};

const MOOD_NAMES = {
  1: "Anxious / Down",
  2: "Restless",
  3: "Centered / Peaceful",
  4: "Joyful",
  5: "Blissful / Elevated"
};

export default function Analytics({ wellnessLogs = [] }) {
  // Ensure we have logs for 7 days. If not, generate dummy historical logs.
  const getWeeklyData = () => {
    const defaultLogs = [
      { day: "Mon", mood: 3, meditation: 15, sleep: 7.5 },
      { day: "Tue", mood: 4, meditation: 20, sleep: 8.0 },
      { day: "Wed", mood: 3, meditation: 10, sleep: 6.5 },
      { day: "Thu", mood: 5, meditation: 30, sleep: 8.5 },
      { day: "Fri", mood: 4, meditation: 25, sleep: 7.0 },
      { day: "Sat", mood: 4, meditation: 0, sleep: 9.0 },
      { day: "Sun", mood: 3, meditation: 10, sleep: 8.0 }
    ];

    // Merge actual logs if they exist.
    // For simplicity, we just use the last few logs or overlay the user's logs.
    const combined = [...defaultLogs];
    
    // We replace the last items in combined with actual wellness logs from state
    if (wellnessLogs.length > 0) {
      // Find today's weekday index (0 = Sun, 1 = Mon... 6 = Sat)
      const todayIdx = new Date().getDay();
      // Map to WEEKDAYS index (Mon = 0, Tue = 1 ... Sun = 6)
      const mappedIdx = todayIdx === 0 ? 6 : todayIdx - 1;
      
      const todayLog = wellnessLogs[wellnessLogs.length - 1];
      combined[mappedIdx] = {
        day: WEEKDAYS[mappedIdx],
        mood: todayLog.mood || 3,
        meditation: todayLog.meditationMinutes || 10,
        sleep: todayLog.sleepHours || 7.0
      };
    }
    return combined;
  };

  const data = getWeeklyData();

  // Calculate high-level stats
  const totalMeditation = data.reduce((acc, log) => acc + log.meditation, 0);
  const avgSleep = (data.reduce((acc, log) => acc + log.sleep, 0) / data.length).toFixed(1);
  const avgMoodIdx = Math.round(data.reduce((acc, log) => acc + log.mood, 0) / data.length);
  const activeDays = data.filter(log => log.meditation > 0 || log.mood > 0).length;

  // Chart Mapping Helpers
  // ViewBox: Width 500, Height 200
  const paddingX = 40;
  const paddingY = 30;
  const chartW = 500 - paddingX * 2;
  const chartH = 200 - paddingY * 2;

  // SVG Mood Line Math
  const getMoodPoints = () => {
    return data.map((log, idx) => {
      const x = paddingX + (idx / (data.length - 1)) * chartW;
      // Mood score is 1 to 5. Map 5 -> top (paddingY), 1 -> bottom (200 - paddingY)
      const y = 200 - paddingY - ((log.mood - 1) / 4) * chartH;
      return { x, y, val: log.mood, day: log.day };
    });
  };

  // SVG Meditation Bar Math
  const getMeditationBars = () => {
    const maxMins = Math.max(...data.map(log => log.meditation), 20); // avoid divide by zero, min max of 20
    return data.map((log, idx) => {
      const colWidth = 24;
      const x = paddingX + (idx / (data.length - 1)) * chartW - colWidth / 2;
      const barH = (log.meditation / maxMins) * chartH;
      const y = 200 - paddingY - barH;
      return { x, y, width: colWidth, height: barH, val: log.meditation, day: log.day };
    });
  };

  const moodPoints = getMoodPoints();
  const meditationBars = getMeditationBars();

  // Construct path string for line chart
  const linePath = moodPoints.reduce((path, p, idx) => {
    return path + `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`;
  }, "");

  // Area path (closed polygon back to bottom)
  const areaPath = linePath + ` L ${moodPoints[moodPoints.length - 1].x} ${200 - paddingY} L ${moodPoints[0].x} ${200 - paddingY} Z`;

  return (
    <div className="animate-fade-in">
      <div className="section-header">
        <h1 className="section-title">Sadhana Analytics</h1>
        <p className="section-subtitle">Track your biological sleep cycles, emotional shifts, and mindfulness streaks to refine your path to equilibrium.</p>
      </div>

      {/* Summary Statistics */}
      <div className="analytics-summary-grid">
        <div className="glass-panel analytic-stat-card">
          <div className="stat-number" style={{ color: 'var(--color-saffron)' }}>{activeDays} Days</div>
          <div className="stat-desc">Sadhana Streak</div>
        </div>
        <div className="glass-panel analytic-stat-card">
          <div className="stat-number" style={{ color: 'var(--color-emerald)' }}>{totalMeditation}m</div>
          <div className="stat-desc">Total Mindfulness Time</div>
        </div>
        <div className="glass-panel analytic-stat-card">
          <div className="stat-number" style={{ color: 'var(--color-indigo)' }}>{avgSleep} hrs</div>
          <div className="stat-desc">Avg Sleep Duration</div>
        </div>
        <div className="glass-panel analytic-stat-card">
          <div className="stat-number" style={{ color: 'var(--color-purple)' }}>{MOOD_EMOJIS[avgMoodIdx] || "😐"}</div>
          <div className="stat-desc">Weekly Balance Index</div>
        </div>
      </div>

      <div className="chart-grid">
        {/* Mood Trend Chart */}
        <div className="glass-panel chart-card">
          <h2 className="chart-title">
            <span className="badge-circle glow-purple" style={{ background: 'var(--color-indigo)' }}></span>
            Emotional Equanimity Trend (Mood Log)
          </h2>
          
          <div className="chart-svg-container">
            <svg width="100%" height="100%" viewBox="0 0 500 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="moodAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-indigo)" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="var(--color-indigo)" stopOpacity="0.0"/>
                </linearGradient>
              </defs>
              
              {/* Horizontal Grid lines */}
              {Array.from({ length: 5 }).map((_, i) => {
                const y = paddingY + (i / 4) * chartH;
                return (
                  <line 
                    key={i} 
                    x1={paddingX} 
                    y1={y} 
                    x2={500 - paddingX} 
                    y2={y} 
                    stroke="rgba(255,255,255,0.05)" 
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                );
              })}

              {/* Area Under Line */}
              <path d={areaPath} fill="url(#moodAreaGrad)" />

              {/* Line */}
              <path d={linePath} fill="none" stroke="var(--color-indigo)" strokeWidth="3" strokeLinecap="round" />

              {/* Data points */}
              {moodPoints.map((p, i) => (
                <g key={i} className="chart-point-group" style={{ cursor: 'pointer' }}>
                  <circle cx={p.x} cy={p.y} r="5" fill="#fff" stroke="var(--color-indigo)" strokeWidth="2.5" />
                  <title>{p.day}: {MOOD_NAMES[p.val]} ({MOOD_EMOJIS[p.val]})</title>
                </g>
              ))}

              {/* X Axis Labels */}
              {moodPoints.map((p, i) => (
                <text 
                  key={i} 
                  x={p.x} 
                  y={200 - 10} 
                  fill="var(--text-secondary)" 
                  fontSize="11" 
                  textAnchor="middle"
                  fontFamily="var(--font-heading)"
                >
                  {p.day}
                </text>
              ))}
            </svg>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
            <span>😢 Low Vitality</span>
            <span>😐 Balanced</span>
            <span>😇 Elevated (*Ojas*)</span>
          </div>
        </div>

        {/* Meditation Time Chart */}
        <div className="glass-panel chart-card">
          <h2 className="chart-title">
            <span className="badge-circle glow-green" style={{ background: 'var(--color-emerald)' }}></span>
            Meditation & Pranayama Minutes
          </h2>

          <div className="chart-svg-container">
            <svg width="100%" height="100%" viewBox="0 0 500 200" preserveAspectRatio="none">
              {/* Horizontal Grid lines */}
              {Array.from({ length: 4 }).map((_, i) => {
                const y = paddingY + (i / 3) * chartH;
                return (
                  <line 
                    key={i} 
                    x1={paddingX} 
                    y1={y} 
                    x2={500 - paddingX} 
                    y2={y} 
                    stroke="rgba(255,255,255,0.05)" 
                    strokeWidth="1"
                  />
                );
              })}

              {/* Bars */}
              {meditationBars.map((bar, i) => (
                <g key={i}>
                  <rect 
                    x={bar.x} 
                    y={bar.y} 
                    width={bar.width} 
                    height={Math.max(bar.height, 2)} // render tiny sliver for 0 mins
                    rx="4" 
                    fill={bar.val > 0 ? "var(--color-emerald)" : "rgba(255,255,255,0.05)"}
                    opacity="0.85"
                    style={{ transition: 'all 0.3s' }}
                  >
                    <title>{bar.day}: {bar.val} minutes</title>
                  </rect>
                  {bar.val > 0 && (
                    <text 
                      x={bar.x + bar.width / 2} 
                      y={bar.y - 6} 
                      fill="var(--color-emerald)" 
                      fontSize="10" 
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      {bar.val}m
                    </text>
                  )}
                </g>
              ))}

              {/* X Axis Labels */}
              {meditationBars.map((bar, i) => (
                <text 
                  key={i} 
                  x={bar.x + bar.width / 2} 
                  y={200 - 10} 
                  fill="var(--text-secondary)" 
                  fontSize="11" 
                  textAnchor="middle"
                  fontFamily="var(--font-heading)"
                >
                  {bar.day}
                </text>
              ))}
            </svg>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
            <span>Weekly Target: 90 Minutes</span>
            <span>Completed: {totalMeditation} Minutes</span>
          </div>
        </div>
      </div>
    </div>
  );
}
