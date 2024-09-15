import { Request, Response } from "express";
import Project from "../models/Project";
import User from "../models/User";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import mongoose from "mongoose";

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
      projects = await Project.find().populate({
        path: "tasks",
        populate: {
          path: "assignedUserId",
          model: "User", // Populate the entire User object
          select: "-password -__v", // Exclude fields you don't want to include
        },
      });
    }
    // Find only assigned projects for Developers
    else if (user.role === "Dev") {
      projects = await Project.find({ assignedUserIds: user._id }).populate({
        path: "tasks",
        populate: {
          path: "assignedUserId",
          model: "User", // Populate the entire User object
          select: "-password -__v", // Exclude fields you don't want to include
        },
      });
    } else {
      return res.status(403).json({
        message: "Forbidden: You do not have access to this resource",
      });
    }

    // Convert the tasks to rename assignedUserId to assignedUser
    const renamedProjects = projects.map((project) => {
      // Convert project to plain object
      const projectObject = project.toObject();

      // Explicitly define the tasks as an array of objects rather than ObjectIds
      projectObject.tasks = projectObject.tasks.map((task: any) => {
        if (task.assignedUserId && typeof task.assignedUserId === "object") {
          // Destructure to rename assignedUserId
          const { assignedUserId, ...taskData } = task;
          return {
            ...taskData,
            assignedUser: assignedUserId, // Rename to assignedUser
          };
        }
        return task; // Return task as-is if assignedUserId is not populated correctly
      });

      return projectObject;
    });

    res.status(200).json(renamedProjects);
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
      assignedUserIds: [],
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

    // Check if user is already assigned to the project
    const isAlreadyAssigned = project.assignedUserIds.some(
      (assignedUserId: mongoose.Types.ObjectId) =>
        assignedUserId.toString() === userId
    );

    if (isAlreadyAssigned) {
      return res
        .status(400)
        .json({ message: "User is already assigned to this project" });
    }

    // Assign userId (not the full user object) if not already assigned
    project.assignedUserIds.push(user._id);
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

    // Filter out the user by userId from assignedUserIds
    project.assignedUserIds = project.assignedUserIds.filter(
      (assignedUserId: mongoose.Types.ObjectId) =>
        assignedUserId.toString() !== userId
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
