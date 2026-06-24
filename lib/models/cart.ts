import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
  productId: number;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
}

export interface ICart extends Document {
  userId: string;
  items: ICartItem[];
  total: number;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    productId: { type: Number, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const CartSchema = new Schema<ICart>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    items: { type: [CartItemSchema], default: [] },
    total: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Cart =
  mongoose.models.Cart ?? mongoose.model<ICart>('Cart', CartSchema);