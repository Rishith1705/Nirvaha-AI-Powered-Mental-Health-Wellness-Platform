import React, { useState } from 'react';

const LIBRARY_DATA = [
  {
    id: 1,
    title: "Surya Namaskar (Sun Salutation)",
    category: "yoga",
    categoryLabel: "Asanas (Yoga)",
    desc: "A classical sequence of 12 powerful yoga postures synchronized with rhythmic breathing. It represents a physical and energetic salutation to the sun.",
    benefits: "Stretches entire body, improves digestive power (Agni), and builds core stamina.",
    warning: "Perform gently if you have lower back stiffness or high blood pressure."
  },
  {
    id: 2,
    title: "Ashwagandha (Indian Ginseng)",
    category: "ayurveda",
    categoryLabel: "Ahar (Diet & Herbs)",
    desc: "An ancient adaptogenic root highly revered in Ayurveda for helping the body adapt to physical, biological, and emotional stressors.",
    benefits: "Reduces cortisol (stress hormone), restores vitality (Ojas), and calms Vata.",
    warning: "Best consumed in the evening in warm milk. Avoid if having acute infection."
  },
  {
    id: 3,
    title: "Nadi Shodhana (Alternate Nostril Breathing)",
    category: "meditation",
    categoryLabel: "Vichar (Mind & Meditation)",
    desc: "A fundamental pranayama technique that balances the subtle energy channels (Ida and Pingala) in the body, promoting nervous system balance.",
    benefits: "Unifies left/right brain hemispheres, reduces heart rate, and focuses concentration.",
    warning: "Do not hold your breath to the point of discomfort. Keep breathing natural."
  },
  {
    id: 4,
    title: "Golden Turmeric Milk (Haldi Doodh)",
    category: "ayurveda",
    categoryLabel: "Ahar (Diet & Herbs)",
    desc: "A comforting Ayurvedic bedtime beverage combining warm milk, organic turmeric powder, black pepper (which aids curcumin absorption), and a touch of honey or ghee.",
    benefits: "Reduces inflammation, builds immunity, and promotes restorative REM sleep.",
    warning: "Do not boil honey directly; add honey only once the milk cools to warm temperature."
  },
  {
    id: 5,
    title: "Vipassana (Mindfulness Meditation)",
    category: "meditation",
    categoryLabel: "Vichar (Mind & Meditation)",
    desc: "An ancient meditation practice focused on observing sensations in the body and thoughts in the mind objectively, without judgment or attachment.",
    benefits: "Dissolves mental conditioning, reduces anxiety, and strengthens patience.",
    warning: "Expect initial restlessness; start with 5-10 minutes and build up gradually."
  },
  {
    id: 6,
    title: "Shavasana (Corpse Pose)",
    category: "yoga",
    categoryLabel: "Asanas (Yoga)",
    desc: "The final resting pose in yoga sessions. Involves lying flat on the back, legs spread slightly, arms open, focusing solely on passive breath observation.",
    benefits: "Calms central nervous system, integrates body changes, and lowers blood pressure.",
    warning: "If lower back hurts, place a folded blanket or bolster under the knees."
  },
  {
    id: 7,
    title: "Triphala Powder (The Three Fruits)",
    category: "ayurveda",
    categoryLabel: "Ahar (Diet & Herbs)",
    desc: "A traditional formula containing Amalaki, Bibhitaki, and Haritaki. It is the most popular Ayurvedic Rasayana (rejuvenative) for digestive health.",
    benefits: "Cleanses digestive tract, supports absorption, and balances all three Doshas.",
    warning: "Has a bitter, astringent taste. Usually taken in warm water before bed."
  },
  {
    id: 8,
    title: "Trataka (Candle Gazing)",
    category: "meditation",
    categoryLabel: "Vichar (Mind & Meditation)",
    desc: "A concentration method involving staring at a single small point, typically a candle flame, without blinking, until eyes water, then closing eyes to visualize the flame.",
    benefits: "Improves eyesight, sharpens focus, and silences racing thoughts.",
    warning: "Avoid if you suffer from severe eye conditions like glaucoma or cataracts."
  }
];

export default function WisdomLibrary({ bookmarkedIds = [], onToggleBookmark }) {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = LIBRARY_DATA.filter(item => {
    const matchesCategory = activeTab === "all" || item.category === activeTab;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="animate-fade-in">
      <div className="section-header">
        <h1 className="section-title">Ancient Wisdom Library</h1>
        <p className="section-subtitle">Browse through verified Ayurvedic herbs, classical Yoga postures, and traditional meditation practices.</p>
      </div>

      <div className="library-search-container">
        <input 
          type="text" 
          className="library-search-input" 
          placeholder="Search remedies, postures, herbs, and philosophies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="library-filters">
        <button 
          className={`btn-outline ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
          style={{ 
            background: activeTab === "all" ? "rgba(255, 153, 51, 0.1)" : "",
            borderColor: activeTab === "all" ? "var(--color-saffron)" : ""
          }}
        >
          All Wisdom
        </button>
        <button 
          className={`btn-outline ${activeTab === "yoga" ? "active" : ""}`}
          onClick={() => setActiveTab("yoga")}
          style={{ 
            background: activeTab === "yoga" ? "rgba(99, 102, 241, 0.1)" : "",
            borderColor: activeTab === "yoga" ? "var(--color-indigo)" : ""
          }}
        >
          Asanas (Yoga)
        </button>
        <button 
          className={`btn-outline ${activeTab === "ayurveda" ? "active" : ""}`}
          onClick={() => setActiveTab("ayurveda")}
          style={{ 
            background: activeTab === "ayurveda" ? "rgba(16, 185, 129, 0.1)" : "",
            borderColor: activeTab === "ayurveda" ? "var(--color-emerald)" : ""
          }}
        >
          Ahar (Diet & Herbs)
        </button>
        <button 
          className={`btn-outline ${activeTab === "meditation" ? "active" : ""}`}
          onClick={() => setActiveTab("meditation")}
          style={{ 
            background: activeTab === "meditation" ? "rgba(139, 92, 246, 0.1)" : "",
            borderColor: activeTab === "meditation" ? "var(--color-purple)" : ""
          }}
        >
          Vichar (Mindfulness)
        </button>
      </div>

      {filteredData.length > 0 ? (
        <div className="cards-grid">
          {filteredData.map((item) => {
            const isBookmarked = bookmarkedIds.includes(item.id);
            return (
              <div key={item.id} className="glass-panel wisdom-card">
                <div className="card-top">
                  <span className={`card-category-badge cat-${item.category}`}>
                    {item.categoryLabel}
                  </span>
                  <button 
                    className={`bookmark-icon-btn ${isBookmarked ? 'active' : ''}`}
                    onClick={() => onToggleBookmark && onToggleBookmark(item.id)}
                    title={isBookmarked ? "Remove Bookmark" : "Bookmark Wisdom"}
                  >
                    {isBookmarked ? "★" : "☆"}
                  </button>
                </div>
                <h3 className="card-title">{item.title}</h3>
                <p className="card-desc">{item.desc}</p>
                <div className="card-benefits">
                  <strong>Prabhava (Effect):</strong> {item.benefits}
                </div>
                <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  <strong>Note:</strong> {item.warning}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No ancient wisdom items found matching your criteria. Try adjusting your search query.
        </div>
      )}
    </div>
  );
}
