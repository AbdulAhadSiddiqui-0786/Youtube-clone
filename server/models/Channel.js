import mongoose from "mongoose";

const ChannelSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        channelName: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        subscribers: {
            type: Number,
            default: 0,
        },
        videos: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Video",
            },
        ],
        channelLogo: {
            type: String, // URL for the channel logo
            default: "",
        },
        channelBanner: {
            type: String, // URL for the channel banner
            default: "",
        },
    },
    { timestamps: true }
);

const Channel = mongoose.model("Channel", ChannelSchema);
export default Channel;