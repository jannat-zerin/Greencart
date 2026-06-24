import mongoose from 'mongoose';
import { products } from '../data/products.js';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable.');
  process.exit(1);
}

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const db = mongoose.connection.db;
  const collection = db.collection('products');

  await collection.deleteMany({});
  console.log('Cleared existing products');

  function computeHealthiness(category) {
    const c = category.toLowerCase();
    if (c.includes('fruit') || c.includes('vegetable') || c.includes('herb')) return 90;
    if (c.includes('meat') || c.includes('seafood')) return 70;
    if (c.includes('dairy')) return 60;
    if (c.includes('pantry') || c.includes('grains') || c.includes('pasta')) return 65;
    if (c.includes('bakery') || c.includes('snack') || c.includes('sweets')) return 35;
    if (c.includes('beverage')) return 60;
    return 50;
  }

  function computePriceHonesty(price) {
    // Mock heuristic: lower-priced everyday staples feel more "honest"; expensive specialty items get lower scores
    if (price < 300) return 4;
    if (price < 500) return 3;
    if (price < 800) return 2;
    return 1;
  }

  const docs = products.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    category: p.category,
    description: p.description,
    healthiness: p.healthiness ?? computeHealthiness(p.category),
    priceHonestyRating: p.priceHonestyRating ?? computePriceHonesty(p.price),
  }));

  await collection.insertMany(docs);
  console.log(`Seeded ${docs.length} products`);

  await mongoose.disconnect();
  console.log('Done');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
