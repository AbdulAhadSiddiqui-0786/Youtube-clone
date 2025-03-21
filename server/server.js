import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import channelRoutes from './routes/channelRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import cors from 'cors';
import path from 'path';
import Video from './models/Video.js';
import SearchVideoByQuery from './routes/searchVideoByQuery.js';
import views from './routes/views.js';
dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/videos", views);
app.get('/api/videos/:videoId/likes', async (req, res) => {
  try {
    const video = await Video.findOne({ _id: req.params.videoId });
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.json({ likes: video.likes, dislikes: video.dislikes });
  } catch (err) {
    console.error('Error fetching likes:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/videos/:videoId/like', async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const userId = req.user?._id; // Assuming you have user authentication
    if (video.likes.includes(userId)) {
      return res.status(400).json({ message: 'You have already liked this video' });
    }

    video.likes.push(userId);
    await video.save();

    res.json({ likes: video.likes.length, dislikes: video.dislikes.length });
  } catch (err) {
    console.error('Error liking video:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
app.post('/api/videos/:videoId/dislike', async (req, res) => {
  try {
    const video = await Video.findOneAndUpdate(
      { _id: req.params.videoId },
      { $inc: { dislikes: 1 } },
      { new: true, upsert: true }
    );
    res.json({ likes: video.likes, dislikes: video.dislikes });
  } catch (err) {
    console.error('Error disliking video:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Serve static files (for uploaded videos)
app.use("/uploads", express.static(path.join("uploads")));

// 🔹 Register Routes
app.use("/api/channels", channelRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes); // t
app.use('/api/comments', commentRoutes);

app.use('/api', SearchVideoByQuery); // Mount the search route

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});