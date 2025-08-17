import { sequelize, User, Product } from './db.js';
import bcrypt from 'bcryptjs';

async function seed() {
  await sequelize.sync({ force: true });
  const [adminHash, userHash] = await Promise.all([
    bcrypt.hash('Admin@1234', 10),
    bcrypt.hash('Test@1234', 10),
  ]);
  await User.create({ name: 'Admin', email: 'admin@example.com', passwordHash: adminHash, role: 'admin' });
  await User.create({ name: 'Test User', email: 'user@example.com', passwordHash: userHash, role: 'user' });

  await Product.bulkCreate([
    { name: 'Velvet Rose Lipstick', category: 'Makeup', basePrice: 19.99, price: 19.99, stock: 50, imageUrl: 'https://picsum.photos/seed/lipstick/600/400', description: 'Long-lasting satin finish.' },
    { name: 'HydraGlow Serum', category: 'Skincare', basePrice: 29.99, price: 29.99, stock: 30, imageUrl: 'https://picsum.photos/seed/serum/600/400', description: 'Hyaluronic + Vit C.' },
    { name: 'Calm Mist Toner', category: 'Skincare', basePrice: 14.99, price: 14.99, stock: 120, imageUrl: 'https://picsum.photos/seed/toner/600/400', description: 'Aloe & green tea.' },
    { name: 'Silk Touch Foundation', category: 'Makeup', basePrice: 24.99, price: 24.99, stock: 10, imageUrl: 'https://picsum.photos/seed/foundation/600/400', description: 'Natural coverage.' }
  ]);
  console.log('Seed complete.');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
