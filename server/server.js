import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import path from 'path';

import authRoutes from './routes/authRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import channelRoutes from './routes/channelRoutes.js';
import searchRoutes from './routes/searchVideoByQuery.js';
import viewsRoutes from './routes/views.js';


import { errorHandler, notFound } from './middleware/errorHandler.js';
import Video from './models/Video.js';
import pingRoute from './routes/pingRoute.js';


app.use('/api', pingRoute);

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// CORS: Restrict to frontend origin in production
app.use(cors({
    origin: [
    'http://localhost:5173', 
    'https://youtube-clone-4ddyc38pc-abdulahadsiddiqui-0786s-projects.vercel.app',
    'https://youtube-clone-swart-eta.vercel.app' 
  ],
  credentials: true,
}));

// Static folder for uploaded videos
app.use("/uploads", express.static(path.join("uploads")));

// ------------------ ROUTES ------------------
app.use('/api/auth', authRoutes);
app.use('/api/videos', viewsRoutes);  // Views and views-related endpoints
app.use('/api/videos', videoRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api', searchRoutes); // Search route

// ------------------ LIKE / DISLIKE ROUTES ------------------

// Get likes/dislikes count
app.get('/api/videos/:videoId/likes', async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    res.json({ likes: video.likes.length, dislikes: video.dislikes.length });
  } catch (err) {
    console.error('Error fetching likes:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like a video
app.post('/api/videos/:videoId/like', async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const userId = req.user._id.toString();

    if (!video.likes.includes(userId)) {
      video.likes.push(userId);
      video.dislikes = video.dislikes.filter(id => id.toString() !== userId); // remove from dislikes
    }

    await video.save();
    res.json({ likes: video.likes.length, dislikes: video.dislikes.length });
  } catch (err) {
    console.error('Error liking video:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dislike a video
app.post('/api/videos/:videoId/dislike',   async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const userId = req.user._id.toString();

    if (!video.dislikes.includes(userId)) {
      video.dislikes.push(userId);
      video.likes = video.likes.filter(id => id.toString() !== userId); // remove from likes
    }

    await video.save();
    res.json({ likes: video.likes.length, dislikes: video.dislikes.length });
  } catch (err) {
    console.error('Error disliking video:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.use(notFound);
app.use(errorHandler);

// ------------------ START SERVER ------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
