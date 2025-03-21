import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        default: '',
    },
    category: {
        type: String,
        default: 'All',
    },
    videoUrl: {
        type: String,
        required: true,
    },
    thumbnailUrl: {
        type: String,
        required: true,
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel',
        required: true,
    },
    views: {
        type: Number,
        default: 0,
      },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
   
    comments: [{  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }],
}, { timestamps: true });

const Video = mongoose.model('Video', videoSchema);
export default Video;
