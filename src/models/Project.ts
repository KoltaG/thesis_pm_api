import mongoose, { Document, Schema, Types } from "mongoose";

export interface IProject extends Document {
  _id: Types.ObjectId;
  name: string;
  assignedUserIds: mongoose.Types.ObjectId[];
  tasks: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    assignedUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  },
  { timestamps: true }
);

export default mongoose.model<IProject>("Project", ProjectSchema);
