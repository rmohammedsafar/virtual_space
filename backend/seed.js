const { sequelize } = require('./config/database');
const User = require('./models/User');
const Space = require('./models/Space');

async function seed() {
  try {
    // Ensure database is synced
    await sequelize.sync();

    // Create a mock seller if one doesn't exist
    let seller = await User.findOne({ where: { role: 'seller' } });
    if (!seller) {
      seller = await User.create({
        email: 'seller@example.com',
        password: 'password123',
        role: 'seller'
      });
      console.log('Created mock seller:', seller.email);
    }

    // Check if spaces exist
    const spacesCount = await Space.count();
    if (spacesCount === 0) {
      await Space.bulkCreate([
        {
          name: 'Downtown Premium Hub',
          address: '123 Market St, Suite 400, San Francisco, CA 94103',
          monthlyPrice: 50.00,
          status: 'available',
          sellerId: seller.id
        },
        {
          name: 'Tech Center Mailroom',
          address: '456 Innovation Dr, San Jose, CA 95112',
          monthlyPrice: 45.00,
          status: 'available',
          sellerId: seller.id
        },
        {
          name: 'Creative Studio Loft',
          address: '789 Arts Ave, Los Angeles, CA 90012',
          monthlyPrice: 60.00,
          status: 'available',
          sellerId: seller.id
        }
      ]);
      console.log('Successfully seeded 3 spaces!');
    } else {
      console.log('Spaces already exist. Skipping seed.');
    }
  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    process.exit(0);
  }
}

seed();
