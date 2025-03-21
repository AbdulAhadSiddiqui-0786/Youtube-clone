import { Link, useNavigate, useParams } from "react-router-dom";
import VideoCard from "../../components/VideoCard/VideoCard";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { FaUpload } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

export default function ChannelPage() {
    const navigate = useNavigate();
    const { channelId } = useParams(); // Get channel ID from URL
    const [channel, setChannel] = useState(null);
    const [channelName, setChannelName] = useState("");
    const [channelDescription, setChannelDescription] = useState(""); // Channel description
    const [videoTitle, setVideoTitle] = useState("");
    const [videoDescription, setVideoDescription] = useState(""); // Video description
    const [category, setCategory] = useState("All");
    const [videoFile, setVideoFile] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [showUploadDialog, setShowUploadDialog] = useState(false);
    const [channelLogo, setChannelLogo] = useState("");
    const [channelBanner, setChannelBanner] = useState("");
    const [showDescriptionPopup, setShowDescriptionPopup] = useState(false); // State for description popup
    const { user } = useAuth();

    // Fetch the user's channel on page load
    useEffect(() => {
        const fetchChannel = async () => {
            if (!channelId) return;

            try {
                const response = await fetch(`http://localhost:5000/api/channels/${channelId}`);
                const data = await response.json();

                if (response.ok) {
                    setChannel(data);
                } else {
                    setChannel(null);
                }
            } catch (error) {
                console.error("Error fetching channel:", error);
            }
        };

        fetchChannel();
    }, [channelId]);

    // Handle creating a new channel
    const handleCreateChannel = async () => {
        if (!channelName.trim()) {
            alert("Channel name is required!");
            return;
        }

        const payload = {
            channelName,
            description: channelDescription, // Use channel description
            channelLogo,
            channelBanner,
        };

        try {
            const response = await fetch("http://localhost:5000/api/channels", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Channel created successfully!");
                setChannel(data);
                navigate(`/channel/${data._id}`);
            } else {
                alert(data.error || "Something went wrong");
            }
        } catch (error) {
            console.error("Error creating channel:", error);
            alert("Failed to create channel");
        }
    };

    // Handle deleting the channel
    const handleDeleteChannel = async () => {
        if (!window.confirm("Are you sure you want to delete your channel?")) return;

        try {
            const response = await fetch("http://localhost:5000/api/channels", {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            const data = await response.json();
            if (response.ok) {
                alert("Channel deleted successfully!");
                setChannel(null);
                setChannelName("");
                setChannelDescription("");
            } else {
                alert(data.error || "Failed to delete channel");
            }
        } catch (error) {
            console.error("Error deleting channel:", error);
            alert("Error deleting channel");
        }
    };

    // Handle uploading a video
    const handleVideoUpload = async () => {
        if (!videoTitle.trim() || !videoFile || !thumbnail) {
            alert("Title, video URL, and thumbnail URL are required!");
            return;
        }

        const payload = {
            title: videoTitle,
            channelId: channel._id,
            description: videoDescription, // Use video description
            videoFile: videoFile, // Video URL
            thumbnail: thumbnail, // Thumbnail URL
            category: category,
        };

        try {
            const response = await fetch("http://localhost:5000/api/videos/upload", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Video uploaded successfully!");
                setChannel({ ...channel, videos: [...channel.videos, data] });
                setVideoTitle("");
                setVideoDescription(""); // Reset video description
                setVideoFile("");
                setThumbnail("");
                setCategory("All");
                setShowUploadDialog(false);
            } else {
                alert(data.message || "Failed to upload video");
            }
        } catch (error) {
            console.error("Error uploading video:", error);
            alert("Error uploading video");
        }
    };

    return (
        <div className="min-h-screen text-white py-8 px-4 sm:px-8 lg:px-16">
            <div className="px-2 sm:px-4">
                {channel ? (
                    <>
                        {/* Channel Banner */}
                        <div className="bg-gray-800 h-32 sm:h-52 rounded-lg my-4 sm:my-6">
                            {channel.channelBanner && (
                                <img
                                    src={channel.channelBanner}
                                    alt="Channel Banner"
                                    className="w-full h-full rounded-lg object-cover"
                                />
                            )}
                        </div>

                        {/* Channel Header */}
                        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
                            <div className="flex items-center space-x-4">
                                {/* Channel Logo */}
                                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
                                    {channel.channelLogo && (
                                        <img
                                            src={channel.channelLogo}
                                            alt="Channel Logo"
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-xl sm:text-2xl font-bold">{channel.channelName}</h1>
                                    <p className="text-gray-400 text-sm sm:text-base">
                                        {channel.subscribers?.toLocaleString()} subscribers
                                    </p>
                                    {/* Truncated Channel Description */}
                                    <div className="text-gray-400 text-sm sm:text-base">
                                        <div className="line-clamp-2" onClick={() => setShowDescriptionPopup(true)}>
                                            {channel.description}
                                        </div>
                                        {channel.description?.split("\n").length > 2 && (
                                            <button
                                                className="text-blue-500 hover:underline"
                                                onClick={() => setShowDescriptionPopup(true)}
                                            >
                                                Show more
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                {channel?.user !== user?._id && (
                                    <button className="bg-white text-black hover:bg-gray-700 px-4 py-2 rounded-full text-sm sm:text-base">
                                        Subscribe
                                    </button>
                                )}
                                {channel?.user === user?._id && (
                                    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                                        <button
                                            onClick={() => setShowUploadDialog(!showUploadDialog)}
                                            className="bg-gray-700 flex items-center gap-2 cursor-pointer hover:bg-gray-800 px-4 py-2 rounded-full whitespace-nowrap text-sm sm:text-base"
                                        >
                                            <FaUpload size={20} />
                                            Upload Video
                                        </button>
                                        <span className="text-gray-400 hidden sm:inline">|</span> {/* Separator */}
                                        <button
                                            onClick={handleDeleteChannel}
                                            className="bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded-full whitespace-nowrap text-sm sm:text-base"
                                        >
                                            Delete Channel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Channel Description Popup - Modified width for larger screens */}
                        {showDescriptionPopup && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black/75 z-50">
                                <div className="bg-gray-800 p-4 sm:p-6 rounded-lg max-w-md sm:max-w-lg md:max-w-xl w-full mx-4 relative max-h-[80vh] overflow-y-auto">
                                    {/* Close Button */}
                                    <IoClose
                                        size={24}
                                        onClick={() => setShowDescriptionPopup(false)}
                                        className="absolute top-4 right-4 cursor-pointer hover:text-red-500"
                                    />
                                    <h2 className="text-xl font-bold mb-4">About {channel.channelName}</h2>
                                    <p className="text-gray-400 whitespace-pre-line mb-4">{channel.description}</p>
    
                                </div>
                            </div>
                        )}

                        {/* Video Upload Section - Modified width for larger screens */}
                        {channel?.user === user?._id && showUploadDialog && (
                            <div className="fixed inset-0 flex items-center bg-black/75 justify-center z-50">
                                <div className="bg-gray-800 p-4 sm:p-6 rounded-lg mb-6 max-w-md sm:max-w-lg md:max-w-xl w-full mx-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <IoClose size={24} onClick={() => setShowUploadDialog(false)} className="absolute hover:text-red-500 top-4 right-4 cursor-pointer" />
                                    <h2 className="text-xl font-bold mb-4">Upload Video</h2>
                                    <select
                                        className="w-full p-2 mb-3 rounded-md border-2 border-white text-white outline-none"
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <option className="text-black" value="All">All</option>
                                        <option className="text-black" value="Music">Music</option>
                                        <option className="text-black" value="Gaming">Gaming</option>
                                        <option className="text-black" value="Live">Live</option>
                                        <option className="text-black" value="Live">News</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Video Title"
                                        value={videoTitle}
                                        onChange={(e) => setVideoTitle(e.target.value)}
                                        className="w-full p-2 mb-3 rounded-md border-2 border-white text-white outline-none"
                                    />
                                    <textarea
                                        type="text"
                                        rows={4}
                                        placeholder="Video Description"
                                        value={videoDescription} // Use video description
                                        onChange={(e) => setVideoDescription(e.target.value)} // Update video description
                                        className="w-full p-2 mb-3 rounded-md border-2 border-white text-white outline-none"
                                    />
                                    <div className="mb-3">
                                        <label className="block text-white mb-1">Video URL</label>
                                        <div className="relative w-full">
                                            <input
                                                type="url"
                                                placeholder="Video URL"
                                                value={videoFile}
                                                onChange={(e) => setVideoFile(e.target.value)}
                                                className="border-2 rounded-lg p-2 w-full cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="block text-white mb-1">Thumbnail URL</label>
                                        <div className="relative w-full">
                                            <input
                                                type="url"
                                                placeholder="Thumbnail URL"
                                                value={thumbnail}
                                                onChange={(e) => setThumbnail(e.target.value)}
                                                className="border-2 rounded-lg p-2 w-full cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleVideoUpload}
                                        className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full cursor-pointer"
                                    >
                                        Upload Video
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Videos Display */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {channel?.videos?.map((video) => (
                                <VideoCard key={video._id} channelVideo={channel} video={video} />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
                        <div className="bg-[#282828] w-[90vw] sm:w-[40rem] p-4 sm:p-6 rounded-lg shadow-lg relative">
                            <h1 className="text-xl sm:text-2xl font-semibold text-white">Create Your Channel</h1>
                            <hr className="border-gray-600 my-3" />
                            <div className="mt-4 space-y-3">
                                <input
                                    type="text"
                                    placeholder="Channel Name"
                                    value={channelName}
                                    onChange={(e) => setChannelName(e.target.value)}
                                    className="w-full p-2 rounded-md border-2 border-white text-white outline-none"
                                />
                                <textarea
                                    placeholder="Channel Description"
                                    value={channelDescription} // Use channel description
                                    onChange={(e) => setChannelDescription(e.target.value)} // Update channel description
                                    className="w-full p-2 h-24 rounded-md border-2 border-white resize-none text-white outline-none"
                                />
                                <input
                                    type="url"
                                    placeholder="Channel Logo URL"
                                    value={channelLogo}
                                    onChange={(e) => setChannelLogo(e.target.value)}
                                    className="w-full p-2 rounded-md border-2 border-white text-white outline-none"
                                />
                                <input
                                    type="url"
                                    placeholder="Channel Banner URL"
                                    value={channelBanner}
                                    onChange={(e) => setChannelBanner(e.target.value)}
                                    className="w-full p-2 rounded-md border-2 border-white text-white outline-none"
                                />
                            </div>
                            <div className="mt-6 flex items-center justify-end gap-4">
                                <Link to="/" className="text-sm sm:text-base">Cancel</Link>
                                <button onClick={handleCreateChannel} className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-700 text-sm sm:text-base">
                                    Create Channel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}