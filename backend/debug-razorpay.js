const axios = require('axios');
require('dotenv').config();

async function debugOrder() {
  const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64');
  
  try {
    const res = await axios.post('https://api.razorpay.com/v1/orders', {
      amount: 42000,
      currency: "INR",
      receipt: "receipt_1"
    }, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    });
    console.log("Success:", res.data);
  } catch (err) {
    if (err.response) {
      console.error("HTTP Error:", err.response.status, err.response.data);
    } else {
      console.error("Network Error:", err.message, err.cause);
    }
  }
}

debugOrder();
