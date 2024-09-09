import mongoose, { Document, Schema, Types } from "mongoose";
import { IUser } from "./User";

export interface IProject extends Document {
  _id: Types.ObjectId;
  name: string;
  assignedUsers: IUser[];
  tasks: mongoose.Types.ObjectId[];
}

const ProjectSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  assignedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
});

export default mongoose.model<IProject>("Project", ProjectSchema);
