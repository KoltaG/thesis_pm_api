import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { createTask, getTasksByProject } from "../controllers/taskController";
import { authorizeRoles } from "../middleware/authorizeRoles";

const router = Router();

/**
 * @swagger
 * /projects/{projectId}/tasks:
 *   post:
 *     summary: Create a new task in a project
 *     tags: [Project Tasks]
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
 *     tags: [Project Tasks]
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
