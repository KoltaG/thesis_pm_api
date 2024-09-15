import { Request, Response } from "express";
import Task from "../models/Task";
import Project from "../models/Project";

export const createTask = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { name, description, assignedUserId } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const task = new Task({
      name,
      description,
      projectId,
      assignedUserId,
      status: "To Do",
    });

    await task.save();

    // Push task's id inot the project's tasks array
    project.tasks.push(task._id);
    await project.save();

    res.status(201).json(task);
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : "Unknown error occurred"
    );
    res.status(500).send("Server Error");
  }
};

export const getTasksByProject = async (req: Request, res: Response) => {
  const { projectId } = req.params;

  try {
    const tasks = await Task.find({ projectId });
    res.status(200).json(tasks);
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : "Unknown error occurred"
    );
    res.status(500).send("Server Error");
  }
};

export const updateTaskStatus = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const { status } = req.body;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.status = status;
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : "Unknown error occurred"
    );
    res.status(500).send("Server Error");
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : "Unknown error occurred"
    );
    res.status(500).send("Server Error");
  }
};

export const assignUserToTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const { userId } = req.body;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.assignedUserId = userId;
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : "Unknown error occurred"
    );
    res.status(500).send("Server Error");
  }
};

export const unassignUserFromTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.assignedUserId = undefined; // Remove the assigned user
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : "Unknown error occurred"
    );
    res.status(500).send("Server Error");
  }
};
