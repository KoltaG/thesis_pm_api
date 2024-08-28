import { Router } from "express";
import {
  updateTaskStatus,
  deleteTask,
  assignUserToTask,
  unassignUserFromTask,
} from "../controllers/taskController";
import { authMiddleware } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/authorizeRoles";

const router = Router();

/**
 * @swagger
 * /tasks/{taskId}:
 *   patch:
 *     summary: Update the status of a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the task
 *     requestBody:
 *       description: New status of the task
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ["To Do", "In Progress", "Done"]
 *                 example: "In Progress"
 *     responses:
 *       200:
 *         description: Task status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */
router.patch(
  "/:taskId",
  authMiddleware,
  authorizeRoles("PM", "Dev"),
  updateTaskStatus
);

/**
 * @swagger
 * /tasks/{taskId}/assign-user:
 *   post:
 *     summary: Assign a user to a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the task
 *     requestBody:
 *       description: User ID to assign to the task
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
 *         description: User assigned to task successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */
router.post(
  "/:taskId/assign-user",
  authMiddleware,
  authorizeRoles("PM"),
  assignUserToTask
);

/**
 * @swagger
 * /tasks/{taskId}/unassign-user:
 *   post:
 *     summary: Unassign a user from a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the task
 *     responses:
 *       200:
 *         description: User unassigned from task successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */
router.post(
  "/:taskId/unassign-user",
  authMiddleware,
  authorizeRoles("PM"),
  unassignUserFromTask
);

/**
 * @swagger
 * /tasks/{taskId}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the task
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */
router.delete("/:taskId", authMiddleware, authorizeRoles("PM"), deleteTask);

export default router;
