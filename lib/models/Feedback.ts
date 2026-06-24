import mongoose, { Schema, models, model } from 'mongoose';

export interface IFeedback {
  _id: mongoose.Types.ObjectId;
  userId?: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'reviewed';
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    userId: { type: String, required: false },
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['new', 'reviewed'],
      default: 'new',
    },
  },
  { timestamps: true }
);

export const Feedback = models.Feedback || model<IFeedback>('Feedback', FeedbackSchema);