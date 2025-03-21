import express from "express";
import { uploadVideo, getVideos, getChannelVideos, getVideoById } from "../controllers/videoController.js";

const router = express.Router();

// Routes
router.post("/upload", uploadVideo);

router.get("/", getVideos); // Get all videos
router.get("/channel/:channelId", getChannelVideos); // Fetch videos from a specific channel
router.get("/:videoId", getVideoById); // Fetch a specific video by ID

export default router; 