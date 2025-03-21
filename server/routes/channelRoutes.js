import express from "express";
import { createChannel, getUserChannel, deleteChannel, getChannelById } from "../controllers/channelController.js";
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Create a channel (Only if the user doesn’t have one)
router.post("/", protect, createChannel);

// Get a user's channel by user ID
router.get("/user/:id", protect, getUserChannel);
router.get("/:id", getChannelById);

// Delete a channel by user ID (only the owner can delete)
router.delete("/", protect, deleteChannel);

export default router;