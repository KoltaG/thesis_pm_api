import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

// @desc    Register a new user
// @route   POST /api/users/register
export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    const { password: _, ...userWithoutPassword } = newUser.toObject();

    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : "Unknown error occurred"
    );
    res.status(500).send("Server Error");
  }
};

// @desc    Log in as a user
// @route   POST /api/users/login
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : "Unknown error occurred"
    );
    res.status(500).send("Server Error");
  }
};

// @desc    Get all users
// @route   GET /api/users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : "Unknown error occurred"
    );
    res.status(500).send("Server Error");
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : "Unknown error occurred"
    );
    res.status(500).send("Server Error");
  }
};
