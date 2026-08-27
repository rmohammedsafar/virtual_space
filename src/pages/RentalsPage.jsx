import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const RentalsPage = () => {
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(savedUser));

    fetch('http://3.110.191.121:5000/api/spaces')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSpaces(data.spaces);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));

    // Load Razorpay Script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, [navigate]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const initiateRent = (space) => {
    setSelectedSpace(space);
    setShowModal(true);
  };

  const processPayment = async (mode) => {
    setShowModal(false);
    const space = selectedSpace;
    const res = await loadRazorpayScript();
    
    if (!res || !window.Razorpay) {
      toast.error("Razorpay SDK failed to load. Are you online? (Please disable ad-blockers)");
      return;
    }

    try {
      let endpoint = mode === 'yearly' ? '/create-order' : '/create-subscription';
      let payload = { spaceId: space.id, planType: mode };

      const orderRes = await fetch(`http://3.110.191.121:5000/api/payments${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const orderData = await orderRes.json();
      
      if (!orderData.success) {
        toast.error(orderData.error || 'Failed to initialize payment');
        return;
      }

      const options = {
        key: 'rzp_test_TTUfmlDlutWjJf',
        name: 'Virtual Space',
        description: mode === 'yearly' ? `1 Year Rent for ${space.name}` : `Autopay for ${space.name}`,
        ...(mode === 'monthly' ? { subscription_id: orderData.subscription.id } : { 
           order_id: orderData.order.id, 
           amount: orderData.order.amount, 
           currency: orderData.order.currency 
        }),
        config: {
          display: {
            blocks: {
              upi: { name: "Pay via UPI", instruments: [{ method: "upi" }] },
              other: { name: "Other Payment Methods", instruments: [{ method: "card" }, { method: "netbanking" }, { method: "wallet" }] }
            },
            sequence: ["block.upi", "block.other"],
            preferences: { show_default_blocks: false }
          }
        },
        handler: async function (response) {
          try {
            const verifyRes = await fetch('http://3.110.191.121:5000/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: user.id,
                spaceId: space.id,
                planType: mode
              })
            });
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              toast.success('Payment successful & space rented!');
              navigate('/user');
            } else {
              toast.error(verifyData.error || 'Payment verification failed!');
            }
          } catch (err) {
            console.error('Verification error:', err);
            toast.error('An error occurred during verification.');
          }
        },
        prefill: {
          name: user.email.split('@')[0],
          email: user.email,
        },
        theme: { color: '#528FF0' },
        modal: {
          ondismiss: async function() {
            toast.error('Payment cancelled by user');
            try {
              await fetch('http://3.110.191.121:5000/api/payments/failure', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: user.id,
                  spaceId: space.id,
                  reason: 'User cancelled the payment popup'
                })
              });
            } catch (err) {
              console.error('Failed to send failure email request:', err);
            }
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', async function (response) {
        toast.error(`Payment Failed: ${response.error.description}`);
        try {
          await fetch('http://3.110.191.121:5000/api/payments/failure', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              spaceId: space.id,
              reason: response.error.description
            })
          });
        } catch (err) {
          console.error('Failed to send failure email request:', err);
        }
      });
      rzp.open();

    } catch (err) {
      console.error(err);
      toast.error('An error occurred initiating payment');
    }
  };

  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', backgroundColor: 'var(--color-bg)', color: 'white', position: 'relative' }}>
      
      {showModal && selectedSpace && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ padding: '3rem', maxWidth: '500px', width: '90%', textAlign: 'center', position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            <h2 style={{ marginBottom: '1rem', color: 'var(--color-primary-light)' }}>Choose Payment Plan</h2>
            <p style={{ marginBottom: '2rem' }}>You are renting <strong>{selectedSpace.name}</strong></p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button onClick={() => processPayment('monthly')} className="btn-secondary" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Monthly Autopay</span>
                <span>₹{selectedSpace.monthlyPrice} / month</span>
              </button>
              
              <button onClick={() => processPayment('yearly')} className="btn-primary" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '15px', right: '-35px', background: '#ff4757', color: 'white', padding: '2px 40px', transform: 'rotate(45deg)', fontSize: '0.8rem', fontWeight: 'bold', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>SAVE 30%</div>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>1-Year Upfront</span>
                <span><del style={{ opacity: 0.7 }}>₹{selectedSpace.monthlyPrice * 12}</del> ₹{selectedSpace.monthlyPrice * 12 * 0.7} (One-Time)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h2><span className="text-gradient">Available Spaces</span></h2>
        <button onClick={() => navigate('/user')} className="btn-secondary">Back to Dashboard</button>
      </header>

      {loading ? (
        <p>Loading spaces...</p>
      ) : spaces.length === 0 ? (
        <p>No spaces available right now.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {spaces.map(space => (
            <div key={space.id} className="glass-panel" style={{ padding: '2rem' }}>
              {space.images && space.images.length > 0 && (
                <img src={space.images[0]} alt={space.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} />
              )}
              <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary-light)' }}>{space.name}</h3>
              <p style={{ marginBottom: '1rem', color: 'var(--color-text)' }}>{space.address}</p>
              <p style={{ marginBottom: '2rem', color: 'var(--color-text-muted)' }}>{space.description || 'A great virtual space.'}</p>
              <button onClick={() => initiateRent(space)} className="btn-primary" style={{ width: '100%' }}>Rent Space</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RentalsPage;
