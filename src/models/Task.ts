import mongoose, { Document, Schema, Types } from "mongoose";
import { IUser } from "./User";
import { IProject } from "./Project";

export type TaskStatus = "To Do" | "In Progress" | "Done";

export interface ITask extends Document {
  _id: Types.ObjectId;
  name: string;
  projectId: IProject["_id"];
  assignedUserId?: IUser["_id"];
  status: TaskStatus;
}

const TaskSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  assignedUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ["To Do", "In Progress", "Done"],
    default: "To Do",
  },
});

export default mongoose.model<ITask>("Task", TaskSchema);
