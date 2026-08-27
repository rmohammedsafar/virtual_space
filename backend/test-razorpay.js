require('dotenv').config();

const Razorpay = require('razorpay');

const keyId = (process.env.RAZORPAY_KEY_ID || '').trim();
const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();

console.log('Key ID loaded:', keyId ? `${keyId.substring(0, 12)}...` : 'NO KEY ID');
console.log('Secret loaded:', keySecret ? 'YES' : 'NO');

const rzp = new Razorpay({
  key_id: keyId,
  key_secret: keySecret
});

async function test() {
  try {
    const result = await rzp.plans.all({
      count: 10
    });

    console.log('✅ Razorpay authentication works!');
    console.log('Plans:', result);
  } catch (err) {
    console.error('❌ Razorpay test failed');
    console.error('Status:', err.statusCode);
    console.error('Error:', err.error);
  }
}

test();
