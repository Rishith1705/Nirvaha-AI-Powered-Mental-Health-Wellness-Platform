import React, { useState } from 'react';

const QUESTIONS = [
  {
    id: 1,
    text: "How would you describe your physical body frame and weight?",
    options: [
      { text: "Thin, light-built, prominent joints, difficult to gain weight", type: "Vata" },
      { text: "Medium-built, muscular, stable weight, gains/loses easily", type: "Pitta" },
      { text: "Broad-built, heavy, large bones, gains weight easily and struggles to lose it", type: "Kapha" }
    ]
  },
  {
    id: 2,
    text: "Which best describes your skin texture and hair quality?",
    options: [
      { text: "Dry, cold, rough skin; thin, dry, curly or frizzy hair", type: "Vata" },
      { text: "Warm, reddish/fair, sensitive skin; soft, fine, early graying hair", type: "Pitta" },
      { text: "Thick, smooth, pale, moist skin; thick, dark, wavy and lustrous hair", type: "Kapha" }
    ]
  },
  {
    id: 3,
    text: "What are your digestion and appetite patterns?",
    options: [
      { text: "Irregular appetite, frequent gas/bloating, variable digestion", type: "Vata" },
      { text: "Strong appetite, gets irritable when hungry ('hangry'), fast digestion", type: "Pitta" },
      { text: "Steady but moderate appetite, slow digestion, feels heavy after meals", type: "Kapha" }
    ]
  },
  {
    id: 4,
    text: "How do you typically react to stress and emotional challenges?",
    options: [
      { text: "I become anxious, fearful, worried, and my mind races", type: "Vata" },
      { text: "I become irritable, angry, impatient, or highly critical", type: "Pitta" },
      { text: "I remain calm, slow to react, but can become withdrawn or stubborn", type: "Kapha" }
    ]
  },
  {
    id: 5,
    text: "What are your sleep characteristics?",
    options: [
      { text: "Light sleeper, wakes up frequently, tends to have insomnia", type: "Vata" },
      { text: "Moderate sleeper, sleeps 6-7 hours, can wake up warm, falls back asleep easily", type: "Pitta" },
      { text: "Deep, long sleeper (8+ hours), hard to wake up, feels groggy in the morning", type: "Kapha" }
    ]
  },
  {
    id: 6,
    text: "Which climate or weather condition do you find most uncomfortable?",
    options: [
      { text: "Cold, dry, and windy weather makes me feel stiff and anxious", type: "Vata" },
      { text: "Hot, humid, and bright sunny weather makes me exhausted and irritable", type: "Pitta" },
      { text: "Damp, cold, and cloudy weather makes me feel sluggish and congested", type: "Kapha" }
    ]
  },
  {
    id: 7,
    text: "How do you handle money and material possessions?",
    options: [
      { text: "Spend impulsively, struggle to save, buy on whims", type: "Vata" },
      { text: "Spend methodically on quality items, planned investments, value-driven", type: "Pitta" },
      { text: "Accumulate wealth, save easily, hate spending unnecessarily, sentimental about items", type: "Kapha" }
    ]
  },
  {
    id: 8,
    text: "How would you describe your style of speaking and walk?",
    options: [
      { text: "Fast talker, jumps between topics, fast and restless walker", type: "Vata" },
      { text: "Direct, articulate, sharp, persuasive speaker; brisk, purposeful walker", type: "Pitta" },
      { text: "Slow, measured, soft-spoken, melodic speaker; slow, graceful walker", type: "Kapha" }
    ]
  },
  {
    id: 9,
    text: "What is your typical pattern of learning and memory?",
    options: [
      { text: "Grasp new ideas very quickly but forget them just as fast", type: "Vata" },
      { text: "Learn quickly, analyze deeply, and retain information logically", type: "Pitta" },
      { text: "Take time to grasp new ideas but remember them forever once learned", type: "Kapha" }
    ]
  },
  {
    id: 10,
    text: "Which emotional state represents your baseline mood?",
    options: [
      { text: "Creative, enthusiastic, active, but prone to worry and change", type: "Vata" },
      { text: "Passionate, goal-driven, competitive, but prone to impatience", type: "Pitta" },
      { text: "Loving, calm, forgiving, steady, but prone to lethargy and attachment", type: "Kapha" }
    ]
  }
];

const DOSHA_PROFILES = {
  Vata: {
    element: "Ether & Air (Vayu)",
    qualities: "Light, dry, cold, mobile, rough",
    summary: "Vata represents motion and flow in the body. Balanced Vata promotes creativity, flexibility, and enthusiasm. Imbalanced Vata leads to anxiety, bloating, insomnia, and dry skin.",
    tips: [
      "Favor warm, cooked, nourishing foods over raw salads and cold drinks.",
      "Incorporate grounding routines: meditate at consistent times daily.",
      "Use warming spices like ginger, cumin, cardamom, and cinnamon.",
      "Practice calming Pranayama (like Nadi Shodhana / Alternate Nostril Breathing)."
    ]
  },
  Pitta: {
    element: "Fire & Water (Agni & Jala)",
    qualities: "Hot, sharp, light, oily, spreading",
    summary: "Pitta governs digestion, metabolism, and transformation. Balanced Pitta brings intelligence, passion, courage, and leadership. Imbalanced Pitta leads to anger, acid reflux, skin rashes, and inflammation.",
    tips: [
      "Favor cooling, fresh foods like cucumber, sweet fruits, and coconut water.",
      "Avoid highly spicy, oily, fermented, or excessively salty foods.",
      "Stay active during cooler parts of the day (early morning or evening).",
      "Cultivate patience, spend time in nature (forests, moonlight), and avoid overworking."
    ]
  },
  Kapha: {
    element: "Earth & Water (Prithvi & Jala)",
    qualities: "Heavy, slow, cold, oily, smooth, stable",
    summary: "Kapha provides structure, stability, lubrication, and cohesion. Balanced Kapha brings strength, stamina, patience, and compassion. Imbalanced Kapha leads to lethargy, weight gain, congestion, and possessiveness.",
    tips: [
      "Favor light, warm, dry, and spicy foods. Avoid heavy, oily, sugary dairy.",
      "Engage in vigorous daily exercise (Kapalbhati breath, active yoga flow).",
      "Keep warm and dry; avoid damp environments.",
      "Seek new experiences, avoid oversleeping, and declutter your environment."
    ]
  }
};

export default function DoshaQuiz({ onSaveDosha, currentDosha }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [percentages, setPercentages] = useState({ Vata: 0, Pitta: 0, Kapha: 0 });
  const [dominant, setDominant] = useState('');

  const handleSelectOption = (type) => {
    const updatedAnswers = [...answers, type];
    setAnswers(updatedAnswers);

    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      calculateResults(updatedAnswers);
    }
  };

  const calculateResults = (finalAnswers) => {
    const counts = { Vata: 0, Pitta: 0, Kapha: 0 };
    finalAnswers.forEach(ans => {
      counts[ans] = (counts[ans] || 0) + 1;
    });

    const total = finalAnswers.length;
    const vataPct = Math.round((counts.Vata / total) * 100);
    const pittaPct = Math.round((counts.Pitta / total) * 100);
    const kaphaPct = Math.round((counts.Kapha / total) * 100);

    const calculatedPct = { Vata: vataPct, Pitta: pittaPct, Kapha: kaphaPct };
    setPercentages(calculatedPct);

    let maxDosha = 'Vata';
    if (counts.Pitta > counts[maxDosha]) maxDosha = 'Pitta';
    if (counts.Kapha > counts[maxDosha]) maxDosha = 'Kapha';
    
    setDominant(maxDosha);
    setShowResult(true);
    if (onSaveDosha) {
      onSaveDosha(maxDosha, calculatedPct);
    }
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setAnswers([]);
    setShowResult(false);
    setPercentages({ Vata: 0, Pitta: 0, Kapha: 0 });
    setDominant('');
  };

  const progressPct = ((currentIdx) / QUESTIONS.length) * 100;

  return (
    <div className="quiz-container animate-fade-in">
      <div className="section-header">
        <h1 className="section-title">Prakriti Analysis</h1>
        <p className="section-subtitle">Discover your biological constitution (Dosha) to personalize your diet, exercises, and mindfulness routines.</p>
      </div>

      {!showResult ? (
        <div className="glass-panel quiz-card">
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${progressPct}%` }}></div>
          </div>
          
          <div className="question-number" style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}>
            Question {currentIdx + 1} of {QUESTIONS.length}
          </div>
          
          <h2 className="question-text">{QUESTIONS[currentIdx].text}</h2>
          
          <div className="options-list">
            {QUESTIONS[currentIdx].options.map((opt, i) => (
              <button 
                key={i} 
                className="option-btn" 
                onClick={() => handleSelectOption(opt.type)}
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass-panel quiz-card">
          <div className="result-header">
            <div className="dosha-badge">YOUR PRAKRITI PROFILE</div>
            <h2 className="section-title" style={{ fontSize: '32px', color: 'var(--color-saffron)' }}>
              {dominant} Prakriti
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
              Your mind-body makeup is predominantly governed by the <strong>{dominant}</strong> dosha.
            </p>
          </div>

          <div className="dosha-chart-container">
            <div className="dosha-bar-group">
              <div className="dosha-bar-outer">
                <div className="dosha-bar-inner vata-fill" style={{ height: `${percentages.Vata}%` }}></div>
              </div>
              <span className="dosha-bar-label" style={{ color: 'var(--color-indigo)' }}>Vata</span>
              <span className="dosha-bar-pct">{percentages.Vata}%</span>
            </div>

            <div className="dosha-bar-group">
              <div className="dosha-bar-outer">
                <div className="dosha-bar-inner pitta-fill" style={{ height: `${percentages.Pitta}%` }}></div>
              </div>
              <span className="dosha-bar-label" style={{ color: 'var(--color-saffron)' }}>Pitta</span>
              <span className="dosha-bar-pct">{percentages.Pitta}%</span>
            </div>

            <div className="dosha-bar-group">
              <div className="dosha-bar-outer">
                <div className="dosha-bar-inner kapha-fill" style={{ height: `${percentages.Kapha}%` }}></div>
              </div>
              <span className="dosha-bar-label" style={{ color: 'var(--color-emerald)' }}>Kapha</span>
              <span className="dosha-bar-pct">{percentages.Kapha}%</span>
            </div>
          </div>

          <div className="dosha-desc-box">
            <div className="dosha-desc-title">About {dominant} Dosha</div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <strong>Elements:</strong> {DOSHA_PROFILES[dominant].element} | <strong>Attributes:</strong> {DOSHA_PROFILES[dominant].qualities}
            </p>
            <p style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
              {DOSHA_PROFILES[dominant].summary}
            </p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#fff' }}>Recommended Daily Sadhana for {dominant}:</h3>
            <ul style={{ listStyleType: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {DOSHA_PROFILES[dominant].tips.map((tip, idx) => (
                <li key={idx} style={{ 
                  fontSize: '13px', 
                  color: 'var(--text-secondary)', 
                  display: 'flex', 
                  gap: '8px', 
                  alignItems: 'flex-start',
                  background: 'rgba(255, 255, 255, 0.01)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)'
                }}>
                  <span style={{ color: 'var(--color-emerald)', fontWeight: 'bold' }}>✓</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="btn-saffron" onClick={resetQuiz}>Retake Analysis</button>
          </div>
        </div>
      )}
    </div>
  );
}
