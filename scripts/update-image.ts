import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const imageMap: Record<string, string> = {
  'Organic Apples': '/images/organic-apple.png',
  'Fresh Bananas': '/images/fresh-bananas.png',
  'Spinach': '/images/spinach.png',
  'Whole Wheat Bread': '/images/whole-wheat-bread.png',
  'Almond Milk': '/images/almond-milk.png',
  'Organic Honey': '/images/organic-honey.png',
  'Strawberries': '/images/strawberries.png',
  'Avocados': '/images/avocados.png',
  'Blueberries': '/images/blue-berries.png',
  'Oranges': '/images/oranges.png',
  'Grapes': '/images/grapes.png',
  'Mangoes': '/images/mangoes.png',
  'Lemons': '/images/lemons.png',
  'Broccoli': '/images/broccoli.png',
  'Carrots': '/images/carrots.png',
  'Tomatoes': '/images/tomates.png',
  'Bell Peppers': '/images/bell-pappers.png',
  'Cucumbers': '/images/cucumbers.png',
  'Kale': '/images/kale.png',
  'Sweet Potatoes': '/images/sweet-potatoes.png',
  'Cauliflower': '/images/cauliflower.png',
  'Sourdough Bread': '/images/whole-wheat-bread.png',
  'Croissants': '/images/croissants.png',
  'Bagels': '/images/bagels.png',
  'Banana Bread': '/images/banana-bread.png',
  'Cheddar Cheese': '/images/cheddar-cheese.png',
  'Greek Yogurt': '/images/greek-yogurt.png',
  'Whole Milk': '/images/whole-milk.png',
  'Butter': '/images/butter.png',
  'Mozzarella': '/images/mozzarella.png',
  'Organic Eggs': '/images/organic-eggs.png',
  'Brown Rice': '/images/brown-rice.png',
  'Quinoa': '/images/quinoa.png',
  'Olive Oil': '/images/olive-oil.png',
  'Pasta': '/images/pasta.png',
  'Peanut Butter': '/images/peanut-butter.png',
  'Granola': '/images/granola.png',
  'Coconut Water': '/images/coconut-water.png',
  'Green Tea': '/images/green-tea.png',
  'Orange Juice': '/images/organic-juice.png',
  'Cold Brew Coffee': '/images/cold-brew-coffee.png',
  'Almonds': '/images/almonds.png',
  'Dark Chocolate': '/images/dark-chocolate.png',
  'Trail Mix': '/images/trail-mix.png',
  'Rice Cakes': '/images/rice-cakes.png',
  'Basil': '/images/basil.png',
  'Mint': '/images/mint.png',
  'Cilantro': '/images/cilantro.png',
  'Salmon Fillet': '/images/salmon-fillet.png',
  'Chicken Breast': '/images/chicken-breast.png',
};

async function updateImages() {
  const { connectDB } = await import('../lib/mongodb');
  const { Product } = await import('../lib/models/Product');

  await connectDB();
  console.log('Connected to DB');

  const allProducts = await Product.find({}).select('name image').lean();
  console.log(`Total products in DB: ${allProducts.length}`);
  console.log('Product names:', JSON.stringify(allProducts.map(p => p.name), null, 2));

  let updated = 0;
  for (const [name, image] of Object.entries(imageMap)) {
    const result = await Product.updateOne({ name }, { $set: { image } });
    console.log(`Trying "${name}": matched=${result.matchedCount}, modified=${result.modifiedCount}`);
    if (result.modifiedCount > 0) {
      updated++;
    }
  }

  console.log(`\nDone! Updated ${updated} products.`);
  process.exit(0);
}

updateImages().catch((err) => {
  console.error(err);
  process.exit(1);
});