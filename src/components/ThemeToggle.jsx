import React, { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: 'var(--color-primary)',
        color: '#fff',
        border: 'none',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        transition: 'transform 0.3s ease'
      }}
      title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeToggle;
