import mongoose, { Document, Schema, Types } from "mongoose";

// Define possible roles
export type Role = "PM" | "Dev";

// Define the interface for a User document
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

// Create the User schema
const UserSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["PM", "Dev"],
      required: true,
    },
  },
  { timestamps: true }
);

// Export the User model
export default mongoose.model<IUser>("User", UserSchema);
