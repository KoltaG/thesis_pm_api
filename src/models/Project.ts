import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";

export interface IProject extends Document {
  name: string;
  assignedUsers: IUser[];
}

const ProjectSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  assignedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

export default mongoose.model<IProject>("Project", ProjectSchema);
