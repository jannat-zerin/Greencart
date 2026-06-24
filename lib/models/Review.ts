import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  userId: string;
  userEmail: string;
  userName: string;
  productId: number;
  rating: number;
  comment: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    userId: { type: String, required: true, index: true },
    userEmail: { type: String, required: true },
    userName: { type: String, default: '' },
    productId: { type: Number, required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
  },
  { timestamps: true }
);

ReviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

export const Review =
  mongoose.models.Review ?? mongoose.model<IReview>('Review', ReviewSchema);
