import React, { useState, useRef, useEffect } from 'react';

const SUGGESTED_PROMPTS = [
  "How can I reduce stress and calm my mind?",
  "What is the best routine to improve sleep?",
  "How should I manage anger or irritability?",
  "What should I eat based on Ayurvedic principles?",
  "Explain the core concept of Yoga.",
  "Which breathing technique helps with mental focus?"
];

const WISDOM_DATABASE = [
  {
    keywords: ["stress", "anxiety", "anxious", "worry", "worried", "fear", "tension", "calm"],
    response: "Stress and anxiety represent a disturbance in the *Vata* dosha (Air & Ether), causing the mind to fluctuate rapidly. The Bhagavad Gita (2.48) counsels: *'Samatvam Yoga Uchyate'* — Equanimity is Yoga. To ground yourself: \n1. Practice **Nadi Shodhana** (Alternate Nostril Breathing) for 5 minutes.\n2. Rest in **Balasana** (Child's Pose) or **Shavasana** (Corpse Pose).\n3. Sip warm herbal tea (Chamomile, Ashwagandha, or Tulsi) and avoid raw, cold foods."
  },
  {
    keywords: ["sleep", "insomnia", "wake up", "night", "restless", "tired", "exhausted"],
    response: "Sleep issues often arise from hyper-stimulated nerves (Vata) or excess internal heat (Pitta). Ancient Ayurveda recommends:\n1. Maintain a consistent sleep schedule, aiming to be in bed by 10:00 PM (before the active Pitta period begins).\n2. Gently rub warm sesame or coconut oil on the soles of your feet and temples before bed.\n3. Try **Box Breathing** (Sama Vritti) to slow your heart rate and trigger your parasympathetic nervous system."
  },
  {
    keywords: ["anger", "angry", "irritated", "frustrated", "impatient", "pitta", "heat"],
    response: "Anger and irritability are manifestations of aggravated *Pitta* dosha (Fire & Water). To cool the flames of the mind:\n1. Perform **Sheetali Pranayama** (Cooling Breath) — inhale through a curled tongue and exhale through the nose.\n2. Favor cooling foods like sweet apples, melons, cucumbers, and coconut water. Avoid chilis, garlic, and vinegar.\n3. Meditate on the quality of *Karuna* (Compassion) and take a silent walk in nature or under moonlight."
  },
  {
    keywords: ["lethargy", "lazy", "depressed", "heavy", "sluggish", "sad", "unmotivated", "kapha"],
    response: "Sluggishness, attachment, and lethargy are typical of an elevated *Kapha* dosha (Earth & Water). To spark your internal fire (*Tejas*):\n1. Practice **Kapalbhati Pranayama** (Breath of Fire) to oxygenate the brain and stimulate digestion.\n2. Engage in a dynamic **Surya Namaskar** (Sun Salutation) yoga flow to move stagnant physical energy.\n3. Eat warm, light, spicy foods and incorporate warming spices like ginger, black pepper, and turmeric."
  },
  {
    keywords: ["diet", "food", "eat", "nutrition", "herbs", "digestion", "appetite"],
    response: "In Ayurveda, food is medicine (*Ahar*). Proper digestion (*Agni*) is the cornerstone of mental clarity. General tips:\n- **Vata (Air)** needs warm, moist, oily, cooked foods (sweet, sour, salty).\n- **Pitta (Fire)** needs cool, refreshing, dry, mild foods (sweet, bitter, astringent).\n- **Kapha (Earth)** needs light, warm, dry, spicy foods (pungent, bitter, astringent).\nAlways eat in a calm, silent environment and chew your food thoroughly."
  },
  {
    keywords: ["breath", "breathing", "pranayama", "focus", "concentration", "mindful"],
    response: "Breath is the bridge between the body and mind. Patanjali's Yoga Sutras define Pranayama as the regulation of Prana (vital force). \n- For **focus**, practice **Nadi Shodhana** to balance the left and right hemispheres of the brain.\n- For **energy**, try **Kapalbhati** (Breath of Fire).\n- For **calming down**, use **Box Breathing** (4s inhale, 4s hold, 4s exhale, 4s hold). Try these out in our interactive **Pranayama Room**!"
  },
  {
    keywords: ["yoga", "asana", "stretching", "poses", "physical"],
    response: "Yoga is not merely physical stretching, but a state of union between consciousness and movement. Asanas prepare the body for meditation. \n- **Balasana (Child's Pose)**: Restores calmness and grounds Vata.\n- **Bhujangasana (Cobra Pose)**: Opens the chest, energizing Kapha.\n- **Adho Mukha Svanasana (Downward Dog)**: Increases circulation to the brain, balancing Pitta."
  },
  {
    keywords: ["gita", "krishna", "scripture", "philosophy"],
    response: "The Bhagavad Gita is essentially a discourse on mental resilience amidst conflict. Krishna explains that mental suffering comes from attachment to outcomes. He advises (2.47): *'Karmanye vadhikaraste ma phaleshu kadachana'* — You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Perform actions with dedication, but release anxiety about the results."
  },
  {
    keywords: ["sutra", "patanjali", "philosophy", "origin"],
    response: "Patanjali's Yoga Sutras (circa 400 CE) outline the Eight Limbs of Yoga. The second sutra: *'Yogash Chitta Vritti Nirodhah'* means **'Yoga is the cessation of the fluctuations of the mind.'** This implies that wellness is achieved not by adding more thoughts, but by quieting the mental noise to see your true, peaceful self."
  }
];

export default function SadhanaChat({ userDosha }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Namaste. I am your Sadhana Guide. ${userDosha ? `I see your dominant constitution is ${userDosha}.` : 'I am here to guide you using ancient Indian wisdom.'} How may I assist you in finding mental balance, choosing remedies, or learning breathwork today?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    if (!textToSend.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const responseText = matchResponse(textToSend);
      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1200);
  };

  const matchResponse = (query) => {
    const lowercaseQuery = query.toLowerCase();
    
    // Check keyword database
    for (const item of WISDOM_DATABASE) {
      if (item.keywords.some(keyword => lowercaseQuery.includes(keyword))) {
        return item.response;
      }
    }

    // Default response if no keywords match
    return `Your query regarding "${query}" touches upon the paths of self-discovery. In ancient wisdom, every question is an invitation to look inward. \n\nTo begin calming your mind right now, focus on your breath. Inhale slowly for 4 seconds, and exhale for 4 seconds. You might also want to take our **Prakriti Analysis** to discover your dominant Dosha, which can help me provide highly tailored remedies.`;
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="section-header">
        <h1 className="section-title">Sadhana AI Guide</h1>
        <p className="section-subtitle">Converse with our virtual coach to discover Ayurvedic remedies, yoga philosophies, and mental grounding practices.</p>
      </div>

      <div className="glass-panel chat-window">
        <div className="chat-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`message-bubble ${msg.sender}`}>
              <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>
              <div className="message-time">{msg.time}</div>
            </div>
          ))}
          {isTyping && (
            <div className="typing-indicator">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="suggested-prompts">
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button 
              key={idx} 
              className="suggested-btn"
              onClick={() => handleSendMessage(prompt)}
              disabled={isTyping}
            >
              {prompt}
            </button>
          ))}
        </div>

        <form 
          className="chat-input-area" 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
        >
          <input 
            type="text" 
            className="chat-input"
            placeholder="Type your question (e.g. stress, sleep, yoga, diet)..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isTyping}
          />
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={isTyping || !inputValue.trim()}
            style={{ borderRadius: '10px', padding: '12px 24px' }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
