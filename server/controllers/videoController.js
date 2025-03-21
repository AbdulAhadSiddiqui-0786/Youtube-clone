import Video from "../models/Video.js";
import Channel from "../models/Channel.js";

/**
 * Upload a video
 */
export const uploadVideo = async (req, res) => {
  try {
    const { title, description, channelId, category, videoFile, thumbnail } = req.body;
    // Ensure the channel exists
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found!" });
    }

    // Create new video with correct channel ID
    const newVideo = new Video({
      title,
      description,
      channel: channelId, // Ensure channel ID is stored correctly
      videoUrl: videoFile,
      thumbnailUrl: thumbnail,
      category
    });

    await newVideo.save();

    // Add video to channel's videos list
    channel.videos.push(newVideo._id);
    await channel.save();

    res.status(201).json(newVideo);
  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(500).json({ message: error.message });
  }
};


/**
 * Get all videos
 */
export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .populate({
        path: "channel",
      })

    res.json({ success: true, videos });
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getVideoById = async (req, res) => {
  try {

    const video = await Video.findById(req.params.videoId)
      .populate({
        path: "channel",
      })
    res.json({ success: true, video });
  } catch (error) {
    console.error("Error fetching video:", error);
  }
}


/**
 * Get all videos from a specific channel
 */
export const getChannelVideos = async (req, res) => {
  try {
    const { channelId } = req.params;

    // Ensure the channel exists
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ success: false, message: "Channel not found!" });
    }

    // Fetch all videos related to this channel
    const videos = await Video.find({ channel: channelId })

    if (!videos || videos.length === 0) {
      return res.status(404).json({ success: false, message: "No videos found for this channel!" });
    }

    res.json({ success: true, videos });

  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
