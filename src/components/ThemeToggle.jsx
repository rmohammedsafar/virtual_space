import React, { useEffect, useState } from 'react';

const ThemeToggle = ({ inline = false }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const buttonStyle = inline 
    ? {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: 'rgba(0, 119, 255, 0.1)',
        color: 'var(--color-primary)',
        border: '1px solid var(--color-border)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        transition: 'all 0.3s ease',
        marginLeft: '10px'
      }
    : {
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
      };

  return (
    <button
      onClick={toggleTheme}
      style={buttonStyle}
      title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
      onMouseOver={e => {
        if (!inline) e.currentTarget.style.transform = 'scale(1.1)';
        else e.currentTarget.style.backgroundColor = 'rgba(0, 119, 255, 0.2)';
      }}
      onMouseOut={e => {
        if (!inline) e.currentTarget.style.transform = 'scale(1)';
        else e.currentTarget.style.backgroundColor = 'rgba(0, 119, 255, 0.1)';
      }}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeToggle;
