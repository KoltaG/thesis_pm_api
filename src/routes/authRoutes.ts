import { Router } from "express";
import {
  createUser,
  getUserById,
  getUsers,
  loginUser,
} from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/authorizeRoles";

const router = Router();

// @route   POST /api/users/register
// @desc    Register a new user
router.post("/register", createUser);

// @route POST /api/users/login
// @desc Login
router.post("/login", loginUser);

// @route   GET /api/users
// @desc    Get all users
router.get("/", authMiddleware, authorizeRoles("PM"), getUsers);

// @route   GET /api/users/:id
// @desc    Get user by ID
router.get("/:id", authMiddleware, authorizeRoles("PM"), getUserById);

export default router;
