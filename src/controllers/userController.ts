import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import bcrypt from "bcrypt";

// @desc    Register a new user
// @route   POST /api/users
export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user instance
    user = new User({
      name,
      email,
      password: await bcrypt.hash(password, 10), // Hash the password
      role,
    });

    // Save the user to the database
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      res.status(500).send("Server Error");
    } else {
      console.error("An unknown error occurred");
      res.status(500).send("Server Error");
    }
  }
};

// @desc    Get all users
// @route   GET /api/users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
