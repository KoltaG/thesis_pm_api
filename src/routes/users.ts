import { Router } from "express";
import {
  createUser,
  getUserById,
  getUsers,
} from "../controllers/userController";

const router = Router();

// @route   POST /api/users
// @desc    Register a new user
router.post("/", createUser);

// @route   GET /api/users
// @desc    Get all users
router.get("/", getUsers);

// @route   GET /api/users/:id
// @desc    Get user by ID
router.get("/:id", getUserById);

export default router;
