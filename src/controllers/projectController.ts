import { Request, Response } from "express";
import Project from "../models/Project";
import User, { IUser } from "../models/User";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

export const getAllProjects = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized: No user information found",
      });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let projects;

    // Find all projects for a Project Manager
    if (user.role === "PM") {
      projects = await Project.find().populate("tasks");
    }
    // Find only assigned projects for Developers
    else if (user.role === "Dev") {
      projects = await Project.find({ assignedUsers: user._id }).populate(
        "tasks"
      );
    } else {
      return res.status(403).json({
        message: "Forbidden: You do not have access to this resource",
      });
    }

    res.status(200).json(projects);
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : "Unknown error occurred"
    );
    res.status(500).send("Server Error");
  }
};

export const addProject = async (req: Request, res: Response) => {
  const { name } = req.body;

  try {
    const newProject = new Project({
      name,
      assignedUsers: [],
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : "Unknown error occurred"
    );
    res.status(500).send("Server Error");
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await Project.findByIdAndDelete(id);
    res.status(200).json({ message: "Project deleted" });
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : "Unknown error occurred"
    );
    res.status(500).send("Server Error");
  }
};

export const assignUserToProject = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { userId } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    project.assignedUsers.push(user);
    await project.save();

    res.status(200).json(project);
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : "Unknown error occurred"
    );
    res.status(500).send("Server Error");
  }
};

export const unassignUserFromProject = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { userId } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.assignedUsers = project.assignedUsers.filter(
      (user: IUser) => user._id.toString() !== userId
    );
    await project.save();

    res.status(200).json(project);
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : "Unknown error occurred"
    );
    res.status(500).send("Server Error");
  }
};
