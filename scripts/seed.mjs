import mongoose from 'mongoose';
import { products } from '../data/product.ts';

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

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function computeHealthiness(product) {
    const category = product.category?.toLowerCase() ?? '';
    const name = product.name?.toLowerCase() ?? '';

    let score = 50;

    if (category.includes('fruit') || category.includes('vegetable') || category.includes('herb')) {
      score = 88;
    } else if (category.includes('meat') || category.includes('seafood')) {
      score = 55;
    } else if (category.includes('dairy')) {
      score = 70;
    } else if (category.includes('pantry') || category.includes('grains') || category.includes('pasta')) {
      score = 64;
    } else if (category.includes('bakery') || category.includes('snack') || category.includes('sweet')) {
      score = 42;
    } else if (category.includes('beverage')) {
      score = 62;
    }

    if (name.includes('organic')) score += 4;
    if (name.includes('fresh') || name.includes('whole')) score += 3;
    if (name.includes('sweet') || name.includes('honey') || name.includes('banana')) score += 2;
    if (name.includes('bread') || name.includes('cookie') || name.includes('cake') || name.includes('soda') || name.includes('juice')) score -= 8;
    if (name.includes('milk') || name.includes('yogurt') || name.includes('cheese')) score += 5;

    return clamp(Math.round(score), 30, 100);
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
    healthiness: computeHealthiness(p),
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
