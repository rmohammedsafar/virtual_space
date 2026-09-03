import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Chatbot = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([

    { role: 'model', text: 'Hi! I am the Quick Space AI Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const handleSend = async (e) => {

    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          history: messages 
        })
      });

      const data = await res.json();
      
      if (data.success) {
        setMessages(prev => [...prev, { role: 'model', text: data.message }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error: ' + (data.error || 'Unknown error') }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I am having trouble connecting right now.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0, 119, 255, 0.4)',
            zIndex: 9999,
            cursor: 'pointer',
            transition: 'transform 0.3s ease',
            border: 'none'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="glass-panel" style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '350px',
          height: '500px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10000,
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
        }}>
          {/* Header */}
          <div style={{
            padding: '15px 20px',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontWeight: '600'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MessageCircle size={20} />
              Quick Space Support
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}>
              <Minimize2 size={18} />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            padding: '20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            background: 'var(--color-bg-dark)'
          }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                padding: '10px 15px',
                borderRadius: '15px',
                borderBottomRightRadius: msg.role === 'user' ? '0' : '15px',
                borderBottomLeftRadius: msg.role === 'model' ? '0' : '15px',
                background: msg.role === 'user' ? 'var(--color-primary)' : 'var(--color-bg-card)',
                color: msg.role === 'user' ? 'white' : 'var(--color-text)',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                fontSize: '0.9rem',
                lineHeight: '1.4'
              }}>
                {msg.text}
              </div>
            ))}
            
            {/* FAQ Quick Replies - Show only if no user messages have been sent yet or always show at bottom */}
            {messages.length === 1 && !isLoading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '5px' }}>Frequently Asked Questions:</p>
                {[
                  { q: 'How do I book a space?', a: 'You can book a space by browsing our catalog, selecting your preferred space, choosing a time slot, and clicking "Book Now".' },
                  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, debit cards, and seamless local payment options during checkout.' },
                  { q: 'Can I cancel my booking?', a: 'Yes, you can cancel your booking from your User Dashboard up to 24 hours before the scheduled time for a full refund.' }
                ].map((faq, idx) => (
                  <button 
                    key={idx}
                    onClick={() => {
                      setMessages(prev => [
                        ...prev, 
                        { role: 'user', text: faq.q },
                        { role: 'model', text: faq.a }
                      ]);
                    }}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--color-primary)',
                      color: 'var(--color-primary)',
                      padding: '8px 12px',
                      borderRadius: '15px',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.background = 'var(--color-primary)';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--color-primary)';
                    }}
                  >
                    {faq.q}
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div style={{
                alignSelf: 'flex-start',
                padding: '10px 15px',
                borderRadius: '15px',
                borderBottomLeftRadius: '0',
                background: 'var(--color-bg-card)',
                display: 'flex',
                gap: '5px'
              }}>
                <span className="typing-dot"></span>
                <span className="typing-dot" style={{animationDelay: '0.2s'}}></span>
                <span className="typing-dot" style={{animationDelay: '0.4s'}}></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} style={{
            padding: '15px',
            background: 'var(--color-bg-card)',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            gap: '10px'
          }}>
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: '10px 15px',
                borderRadius: '20px',
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg-dark)',
                color: 'var(--color-text)',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: (isLoading || !input.trim()) ? 'var(--color-secondary)' : 'var(--color-primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: (isLoading || !input.trim()) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Send size={18} style={{ marginLeft: '2px' }} />
            </button>
          </form>
        </div>
      )}

      {/* Typing animation styles */}
      <style>{`
        .typing-dot {
          width: 6px;
          height: 6px;
          background-color: var(--color-text-muted);
          border-radius: 50%;
          animation: typing 1s infinite alternate;
        }
        @keyframes typing {
          0% { transform: translateY(0); opacity: 0.5; }
          100% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default Chatbot;
