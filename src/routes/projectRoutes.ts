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
import { createTask, getTasksByProject } from "../controllers/taskController";

const router = Router();

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *       500:
 *         description: Server error
 */
router.get("/", authMiddleware, authorizeRoles("PM", "Dev"), getAllProjects);

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Add new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Project object that needs to be created
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       500:
 *         description: Server error
 */
router.post("/", authMiddleware, authorizeRoles("PM"), addProject);

/**
 * @swagger
 * /projects/delete/{id}:
 *   delete:
 *     summary: Remove a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the project to delete
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.delete(
  "/delete/:id",
  authMiddleware,
  authorizeRoles("PM"),
  deleteProject
);

/**
 * @swagger
 * /projects/{projectId}/assign-user:
 *   post:
 *     summary: Assign user to project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the project
 *     requestBody:
 *       description: The user ID to be assigned to the project
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "60d0fe4f5311236168a109ca"
 *     responses:
 *       200:
 *         description: User assigned to project successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.post(
  "/:projectId/assign-user",
  authMiddleware,
  authorizeRoles("PM"),
  assignUserToProject
);

/**
 * @swagger
 * /projects/{projectId}/unassign-user:
 *   post:
 *     summary: Unassign user from project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the project
 *     requestBody:
 *       description: The user ID to be unassigned from the project
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "60d0fe4f5311236168a109ca"
 *     responses:
 *       200:
 *         description: User unassigned from project successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.post(
  "/:projectId/unassign-user",
  authMiddleware,
  authorizeRoles("PM"),
  unassignUserFromProject
);

// Project tasks routes

/**
 * @swagger
 * /projects/{projectId}/tasks:
 *   post:
 *     summary: Create a new task in a project
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the project
 *     requestBody:
 *       description: Task object that needs to be created
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "New Task"
 *               assignedUserId:
 *                 type: string
 *                 example: "60d0fe4f5311236168a109ca"
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.post(
  "/:projectId/tasks",
  authMiddleware,
  authorizeRoles("PM", "Dev"),
  createTask
);

/**
 * @swagger
 * /projects/{projectId}/tasks:
 *   get:
 *     summary: Get all tasks for a specific project
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the project
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.get(
  "/:projectId/tasks",
  authMiddleware,
  authorizeRoles("PM", "Dev"),
  getTasksByProject
);

export default router;
