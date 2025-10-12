import mongoose, { Schema, Document, Model } from 'mongoose';

export interface UserDocument extends Document {
  name: string;
  email: string;
  // In a real app, store password hashes, not plain text
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<UserDocument> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export const User: Model<UserDocument> = mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);


