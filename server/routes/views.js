import express from "express";
import Video from "../models/Video.js";

const router = express.Router();

// Increment video views
router.post("/:videoId/views", async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.videoId,
      { $inc: { views: 1 } }, // Increment views by 1
      { new: true }
    );

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.status(200).json({ views: video.views });
  } catch (error) {
    console.error("Error incrementing views:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;