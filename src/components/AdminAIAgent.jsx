import React, { useState } from 'react';

const AdminAIAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://3.110.191.121:5000/api/admin-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage.text,
          history: messages 
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessages([...newMessages, { role: 'model', text: data.message }]);
      } else {
        setMessages([...newMessages, { role: 'model', text: 'Error: ' + data.error }]);
      }
    } catch (error) {
      console.error('Error sending message to AI agent:', error);
      setMessages([...newMessages, { role: 'model', text: 'Error: Could not connect to AI Agent.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={toggleChat}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-primary)',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          fontSize: '24px'
        }}
      >
        🤖
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="glass-panel" style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          width: '350px',
          height: '500px',
          backgroundColor: '#0f172a', /* Solid dark blue to prevent bleed-through */
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          border: '1px solid var(--color-border)',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '15px',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>DB Agent Assistant</h3>
            <button onClick={toggleChat} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}>&times;</button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            padding: '15px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            {messages.length === 0 && (
              <p style={{ textAlign: 'center', color: '#aaa', fontSize: '0.9rem', marginTop: 'auto', marginBottom: 'auto' }}>
                Hi Admin! I can query the database for you. Try asking:<br/><br/>
                "How many users do we have?"<br/>
                "Show me the most recent spaces."
              </p>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.role === 'user' ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                color: 'white',
                padding: '10px 14px',
                borderRadius: '12px',
                maxWidth: '85%',
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap',
                fontSize: '0.95rem',
                borderBottomRightRadius: msg.role === 'user' ? '4px' : '12px',
                borderBottomLeftRadius: msg.role === 'user' ? '12px' : '4px'
              }}>
                {msg.role === 'model' ? msg.text.replace(/[*#]/g, '') : msg.text}
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', color: '#aaa', fontSize: '0.8rem', padding: '5px' }}>
                Thinking...
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} style={{
            display: 'flex',
            padding: '10px',
            borderTop: '1px solid var(--color-border)',
            backgroundColor: 'rgba(0,0,0,0.2)'
          }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'rgba(255,255,255,0.05)',
                color: 'white',
                outline: 'none'
              }}
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              style={{
                marginLeft: '10px',
                padding: '0 15px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                cursor: (isLoading || !input.trim()) ? 'not-allowed' : 'pointer',
                opacity: (isLoading || !input.trim()) ? 0.5 : 1
              }}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AdminAIAgent;
