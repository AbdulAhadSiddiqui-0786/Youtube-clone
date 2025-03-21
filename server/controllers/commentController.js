import Comment from '../models/Comment.js';
import Video from '../models/Video.js';

export const createComment = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { content } = req.body;
    if (!content.trim()) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    const video = await Video.findById(req.params.videoId);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const comment = await Comment.create({
      content,
      video: video._id,
      user: req.user.id,
    });

    // Populate user with username, avatar, and channelLogo
    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'username avatar channelLogo');

    // Ensure video.comments is an array before pushing
    if (!video.comments) {
      video.comments = [];
    }

    video.comments.push(comment._id);
    await video.save();

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error("Error in createComment:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//  Fetch comments for a video
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ video: req.params.videoId })
      .populate({
        path: 'user',
        populate:{
          path: 'channels'
        }
      })
      .populate({
        path: 'video',
        populate: {
          path: 'channel'
        }
      })
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    console.error("Error in getComments:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//   Update a comment
export const updateComment = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this comment' });
    }

    comment.content = req.body.content.trim() || comment.content;
    const updatedComment = await comment.save();

    const populatedComment = await Comment.findById(updatedComment._id).populate('user', 'username avatar');
    res.json(populatedComment);
  } catch (error) {
    console.error("Error in updateComment:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//   Delete a comment
export const deleteComment = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(req.params.id);

    // Remove comment reference from video
    await Video.updateOne(
      { _id: comment.video },
      { $pull: { comments: comment._id } }
    );

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error("Error in deleteComment:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
