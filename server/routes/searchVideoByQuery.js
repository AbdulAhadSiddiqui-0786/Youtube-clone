import express from "express";
import Video from "../models/Video.js";
import Channel from "../models/Channel.js";

const router = express.Router();

router.get('/search', async (req, res) => {
    try {
        const { q } = req.query; // Get the search query from the URL query parameters
        if (!q) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        // Use MongoDB's $regex to perform a case-insensitive search
        const videos = await Video.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
            ],
        }).populate('channel');

        res.status(200).json({ videos });
    } catch (error) {
        console.error('Error searching videos:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router; 