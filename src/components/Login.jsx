import React, { useState } from 'react';

const WELLNESS_INTENTIONS = [
  { id: 'calm', label: 'Calm Anxiety & Stress' },
  { id: 'sleep', label: 'Improve Sleep Quality' },
  { id: 'yoga', label: 'Learn Yoga & Poses' },
  { id: 'diet', label: 'Ayurvedic Diet Guide' },
  { id: 'general', label: 'General Well-Being' }
];

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [isGuestSetup, setIsGuestSetup] = useState(false); // Guest onboarding state
  
  // Credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [intention, setIntention] = useState('general');
  const [error, setError] = useState('');

  // Guest Onboarding Info
  const [guestName, setGuestName] = useState('');
  const [guestIntention, setGuestIntention] = useState('general');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all credential fields.');
      return;
    }

    if (isRegister && !name.trim()) {
      setError('Please enter your name to register.');
      return;
    }

    // Mock Authentication
    const userProfile = {
      name: isRegister ? name : email.split('@')[0],
      email: email,
      intention: isRegister ? intention : 'general',
      isGuest: false
    };

    if (onLogin) {
      onLogin(userProfile);
    }
  };

  const handleGuestSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!guestName.trim()) {
      setError('Please tell us what we should call you.');
      return;
    }

    const guestProfile = {
      name: guestName,
      email: 'guest@nirvaha.ai',
      intention: guestIntention,
      isGuest: true
    };

    if (onLogin) {
      onLogin(guestProfile);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100vw',
      position: 'fixed',
      top: 0,
      left: 0,
      background: `linear-gradient(rgba(10, 7, 4, 0.68), rgba(10, 7, 4, 0.75)), url('/wellness_bg.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      zIndex: 999,
      overflow: 'hidden'
    }}>
      {/* Centered Temple Archway & Diya Backdrop */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none' stroke='%23ff9933' stroke-opacity='0.02' stroke-width='0.7'%3E%3Crect x='15' y='40' width='5' height='50' rx='1'/%3E%3Crect x='12' y='36' width='11' height='4'/%3E%3Crect x='10' y='88' width='15' height='4'/%3E%3Crect x='80' y='40' width='5' height='50' rx='1'/%3E%3Crect x='77' y='36' width='11' height='4'/%3E%3Crect x='75' y='88' width='15' height='4'/%3E%3Cpath d='M 17 36 Q 50 12 83 36'/%3E%3Cpath d='M 17 30 Q 50 2 83 30'/%3E%3Cpath d='M 50 18 L 50 48'/%3E%3Cpath d='M 46 48 C 46 54, 54 54, 54 48 Z' fill='%23ff9933' fill-opacity='0.01'/%3E%3Cpath d='M 50 48 C 48 43, 52 43, 50 37 C 48 43, 52 43, 50 48 Z' fill='%23ff7700' fill-opacity='0.03' stroke='%23ffaa00' stroke-opacity='0.04'/%3E%3C/svg%3E")`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        pointerEvents: 'none',
        zIndex: 1
      }} />
      {/* Background embers */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div 
          key={i} 
          style={{
            position: 'absolute',
            bottom: '-10px',
            left: `${5 + Math.random() * 90}%`,
            width: `${4 + Math.random() * 4}px`,
            height: `${4 + Math.random() * 4}px`,
            borderRadius: '50%',
            background: 'var(--color-saffron)',
            animation: `floatEmbers ${4 + Math.random() * 4}s linear infinite`,
            animationDelay: `${Math.random() * 3}s`,
            opacity: 0.3
          }}
        />
      ))}

      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '40px 32px',
        margin: '20px',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Logo and Greeting */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, var(--color-saffron), var(--color-indigo))',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '32px',
            color: '#fff',
            margin: '0 auto 16px',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
            fontFamily: 'var(--font-heading)'
          }}>
            N
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: '700', letterSpacing: '0.5px' }}>
            Nirvaha Wellness
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '6px' }}>
            Ancient Indian wisdom meets modern AI guidance
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            color: '#f87171',
            padding: '10px 14px',
            fontSize: '13px',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {!isGuestSetup ? (
          /* STANDARD SIGN IN / REGISTER FORM */
          <>
            {/* Tab switch */}
            <div style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              padding: '4px',
              marginBottom: '24px'
            }}>
              <button
                style={{
                  flex: 1,
                  padding: '8px',
                  border: 'none',
                  background: !isRegister ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                  color: !isRegister ? '#fff' : 'var(--text-secondary)',
                  fontWeight: '600',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  transition: 'all 0.2s'
                }}
                onClick={() => { setIsRegister(false); setError(''); }}
              >
                Sign In
              </button>
              <button
                style={{
                  flex: 1,
                  padding: '8px',
                  border: 'none',
                  background: isRegister ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                  color: isRegister ? '#fff' : 'var(--text-secondary)',
                  fontWeight: '600',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  transition: 'all 0.2s'
                }}
                onClick={() => { setIsRegister(true); setError(''); }}
              >
                Create Account
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {isRegister && (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      color: '#fff',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Email Address</label>
                <input
                  type="email"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Passphrase</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              {isRegister && (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Primary Intention</label>
                  <select
                    value={intention}
                    onChange={(e) => setIntention(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(20, 20, 35, 1)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      color: '#fff',
                      fontSize: '14px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {WELLNESS_INTENTIONS.map(i => (
                      <option key={i.id} value={i.id}>{i.label}</option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="btn-saffron"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '15px',
                  marginTop: '12px',
                  justifyContent: 'center'
                }}
              >
                {isRegister ? 'Register & Begin' : 'Enter Sanctuary'}
              </button>
            </form>

            <div style={{
              textAlign: 'center',
              marginTop: '24px',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '16px'
            }}>
              <button
                onClick={() => { setIsGuestSetup(true); setError(''); }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-indigo)',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '13px',
                  textDecoration: 'underline'
                }}
              >
                Continue as Guest
              </button>
            </div>
          </>
        ) : (
          /* GUEST ONBOARDING SCREEN */
          <>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '600', color: 'var(--color-saffron)' }}>
                Guest Sanctuary Entry
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
                Tell us a bit about your journey before entering the space.
              </p>
            </div>

            <form onSubmit={handleGuestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>What should we call you?</label>
                <input
                  type="text"
                  placeholder="e.g. Srinivas, Anjali, Venkat"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Primary Intention</label>
                <select
                  value={guestIntention}
                  onChange={(e) => setGuestIntention(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(20, 20, 35, 1)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {WELLNESS_INTENTIONS.map(i => (
                    <option key={i.id} value={i.id}>{i.label}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="btn-saffron"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '15px',
                  marginTop: '12px',
                  justifyContent: 'center'
                }}
              >
                Enter Sanctuary
              </button>
            </form>

            <div style={{
              textAlign: 'center',
              marginTop: '24px',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '16px'
            }}>
              <button
                onClick={() => { setIsGuestSetup(false); setError(''); }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '13px',
                  textDecoration: 'underline'
                }}
              >
                Back to Sign In / Sign Up
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
