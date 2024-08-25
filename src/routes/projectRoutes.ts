import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  addProject,
  assignUserToProject,
  deleteProject,
  getAllProjects,
  unassignUserFromProject,
} from "../controllers/projectController";
import { authorizeRoles } from "../middleware/authorizeRoles";

const router = Router();

// @route   GET /api/projects
// @desc    Get all projects
router.get("/", authMiddleware, getAllProjects); //Doesn't use authorizeRoles here, becasue there is logic inside

// @route POST /api/projects
// @desc Add new project
router.post("/", authMiddleware, authorizeRoles("PM"), addProject);

// @route POST /api/projects/delete/:id
// @desc Remove project
router.delete(
  "/delete/:id",
  authMiddleware,
  authorizeRoles("PM"),
  deleteProject
);

// @route POST /api/projects/:projectId/assign-user
// @desc Assign user to project
router.post(
  "/:projectId/assign-user",
  authMiddleware,
  authorizeRoles("PM"),
  assignUserToProject
);

// @route POST /api/projects/:projectId/unassign-user
// @desc Unassign user to project
router.post(
  "/:projectId/unassign-user",
  authMiddleware,
  authorizeRoles("PM"),
  unassignUserFromProject
);

export default router;
