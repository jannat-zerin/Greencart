import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface IOrderStatusEvent {
  status: string;
  updatedAt: Date;
}

export interface IOrder extends Document {
  items: IOrderItem[];
  total: number;
  status: string;
  statusHistory: IOrderStatusEvent[];
  paymentMethod: 'cash' | 'bkash';
  deliveryAddress: string;
  userId?: string;
  createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Number, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const OrderStatusEventSchema = new Schema<IOrderStatusEvent>(
  {
    status: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    items: { type: [OrderItemSchema], required: true },
    total: { type: Number, required: true },
    status: { type: String, required: true, default: 'pending' },
    statusHistory: { type: [OrderStatusEventSchema], default: [] },
    paymentMethod: { type: String, enum: ['cash', 'bkash'], required: true, default: 'cash' },
    deliveryAddress: { type: String, default: '' },
    userId: { type: String, index: true, default: null },
  },
  { timestamps: true }
);

export const Order =
  mongoose.models.Order ?? mongoose.model<IOrder>('Order', OrderSchema);
