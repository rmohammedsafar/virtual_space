// using native fetch

async function testOrder(planType) {
  try {
    const res = await fetch('http://localhost:5000/api/payments/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ spaceId: 1, planType })
    });
    const data = await res.json();
    console.log(`Plan: ${planType}, Success: ${data.success}, Error: ${data.error}`);
  } catch (err) {
    console.error('Fetch Error:', err);
  }
}

async function run() {
  await testOrder('monthly');
  await testOrder('yearly');
}

run();
