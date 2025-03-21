import express from 'express';
import {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Route: /api/comments/:videoId
router.route('/:videoId')
  .get(getComments) // Fetch comments for a video
  .post(protect, createComment); // Create a new comment

// Route: /api/comments/:id
router.route('/:id')
  .put(protect, updateComment) // Update a comment
  .delete(protect, deleteComment); // Delete a comment

export default router;