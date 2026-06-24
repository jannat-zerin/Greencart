import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';

const correctPrices: Record<string, number> = {
  "Organic Apples": 254,
  "Fresh Bananas": 20,
  "Spinach": 339,
  "Whole Wheat Bread": 381,
  "Almond Milk": 279,
  "Organic Honey": 679,
  "Strawberries": 424,
  "Avocados": 211,
  "Blueberries": 509,
  "Oranges": 296,
  "Grapes": 364,
  "Mangoes": 339,
  "Lemons": 169,
  "Broccoli": 254,
  "Carrots": 169,
  "Tomatoes": 296,
  "Bell Peppers": 211,
  "Cucumbers": 152,
  "Kale": 339,
  "Sweet Potatoes": 194,
  "Cauliflower": 296,
  "Sourdough Bread": 509,
  "Croissants": 424,
  "Bagels": 339,
  "Banana Bread": 551,
  "Cheddar Cheese": 509,
  "Greek Yogurt": 381,
  "Whole Milk": 322,
  "Butter": 364,
  "Mozzarella": 424,
  "Organic Eggs": 466,
  "Brown Rice": 339,
  "Quinoa": 509,
  "Olive Oil": 849,
  "Pasta": 154,
  "Peanut Butter": 424,
  "Granola": 551,
  "Coconut Water": 254,
  "Green Tea": 424,
  "Orange Juice": 180,
  "Cold Brew Coffee": 120,
  "Almonds": 679,
  "Dark Chocolate": 424,
  "Trail Mix": 594,
  "Rice Cakes": 296,
  "Basil": 211,
  "Mint": 211,
  "Cilantro": 169,
  "Salmon Fillet": 1104,
  "Chicken Breast": 849,
};

export async function GET() {
  await connectDB();
  const db = mongoose.connection.db!;

  for (const [name, price] of Object.entries(correctPrices)) {
    await db.collection('products').updateMany(
      { name },
      { $set: { price } }
    );
  }

  return NextResponse.json({ message: 'Done! All prices fixed.' });
}