import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
 
  healthiness?: number;
 
  priceHonestyRating?: number;
}

const ProductSchema = new Schema<IProduct>(
  {
    id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    healthiness: { type: Number, required: false, min: 0, max: 100, default: 50 },
    priceHonestyRating: { type: Number, required: false, min: 0, max: 5, default: 3 },
  },
  { timestamps: true }
);

export const Product =
  mongoose.models.Product ?? mongoose.model<IProduct>('Product', ProductSchema);
