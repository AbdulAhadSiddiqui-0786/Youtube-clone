import mongoose from "mongoose";
import Video from "../models/Video.js";
import User from "../models/User.js";
import Channel from "../models/Channel.js";


// Create a channel (Ensure one user can only create one channel)
export const createChannel = async (req, res) => {
    try {
        const { channelName, description, channelLogo, channelBanner } = req.body;

        // Check if the user already has a channel
        const existingChannel = await Channel.findOne({ user: req.user._id });

        if (existingChannel) {
            return res.status(400).json({ error: "You have already created a channel" });
        }

        // Create a new channel
        const newChannel = new Channel({
            user: req.user._id,
            channelName,
            description,
            channelLogo,
            channelBanner,
        });

        await newChannel.save();

        // Update the user's document to include the channel ID
        await User.findByIdAndUpdate(req.user._id, { channels: newChannel._id });

        res.status(201).json(newChannel);
    } catch (error) {
        console.error("Error creating channel:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Other controller functions remain unchanged...


export const getChannelById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid channel ID format" });
        }

        const channel = await Channel.findById(id).populate("videos");;

        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        res.json(channel);
    } catch (error) {
        console.error("Error fetching channel:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get the user's channel
export const getUserChannel = async (req, res) => {
    try {
        const userId = req.params.id; // Get user ID from request params

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        // Find user and populate the channel field
        const user = await User.findById(userId).populate("channel");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.channels) {
            return res.status(404).json({ message: "Channel not found for this user" });
        }

        res.json(user.channels);
    } catch (error) {
        console.error("Error fetching channel:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Delete a channel
export const deleteChannel = async (req, res) => {
    try {
        // Find and delete the channel associated with the user
        const channel = await Channel.findOneAndDelete({ user: req.user._id });

        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        // Remove the channel reference from the user's document
        await User.findByIdAndUpdate(req.user._id, { $unset: { channel: 1 } });

        res.json({ message: "Channel deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};