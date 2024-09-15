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
 *         description: The ID of the project
 *         schema:
 *           type: string
 *         required: true
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
 *                 description: The name of the task
 *                 example: "New Task"
 *               description:
 *                 type: string
 *                 description: A brief description of the task, max length 500 characters
 *                 example: "This task involves setting up the project environment."
 *               assignedUserId:
 *                 type: string
 *                 description: The ID of the user assigned to the task
 *                 example: "60d0fe4f5311236168a109ca"
 *               status:
 *                 type: string
 *                 description: The current status of the task (e.g., 'To Do', 'In Progress', 'Done')
 *                 example: "To Do"
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
