import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { BiLike, BiDislike, BiSolidLike, BiSolidDislike } from 'react-icons/bi';
import { FaShare } from 'react-icons/fa';
import axios from 'axios';
import CommentSection from '../../components/CommentSection/CommentSection';
import RecommendationVideo from '../../components/RecommendationVideo/RecommendationVideo';

export default function VideoPlayerPage() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [isLike, setIsLike] = useState(false);
  const [isDisLike, setIsDisLike] = useState(false);
  const [expandDesc, setExpandDesc] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/videos/${videoId}`);
        setVideo(response.data.video);
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    };
    fetchVideo();
  }, [videoId]);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/videos/${videoId}/likes`);
        setLikes(response.data.likes);
        setDislikes(response.data.dislikes);
      } catch (error) {
        console.error('Error fetching likes:', error);
      }
    };
    fetchLikes();
  }, [videoId]);

  // Increment View Count
  useEffect(() => {
    const incrementViews = async () => {
      try {
        await axios.post(`http://localhost:5000/api/videos/${videoId}/views`);
      } catch (error) {
        console.error('Error incrementing views:', error);
      }
    };

    incrementViews();
  }, [videoId]);

  const handleLike = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/videos/${videoId}/like`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Send token if required
        },
      });
      setLikes(response.data.likes);
      setDislikes(response.data.dislikes);
      setIsLike(true);
      setIsDisLike(false);
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  const handleDislike = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/videos/${videoId}/dislike`);
      setLikes(response.data.likes);
      setDislikes(response.data.dislikes);
      setIsDisLike(true);
      setIsLike(false);
    } catch (error) {
      console.error('Error disliking video:', error);
    }
  };

  const handleShare = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    alert(`Link copied to clipboard!\n${link}`);
  };

  if (!video) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#0f0f0f] text-white">
        <h1 className="text-2xl font-bold">Video not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row gap-6 bg-[#0f0f0f] text-white py-20 md:py-20 px-4 lg:px-8">
      {/* Main Content Section */}
      <div className="w-full lg:w-2/3 space-y-6">
        {/* Video Player */}
        <div className="aspect-video bg-black rounded-xl overflow-hidden">
          <ReactPlayer 
            url={`http://localhost:5000${video.videoUrl}`} 
            controls 
            width="100%" 
            height="100%"
          />
        </div>

        {/* Video Details */}
        <div className="space-y-4">
          <h1 className="text-xl md:text-2xl font-bold">{video.title}</h1>
          
          {/* Channel Info and Actions */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <img 
                src={video.channel?.channelLogo || 'https://dummyimage.com/64x64'} 
                className="w-10 h-10 rounded-full" 
                alt="Channel" 
              />
              <div>
                <Link 
                  to={`/channel/${video.channel?._id}`} 
                  className="font-bold hover:text-white/80"
                >
                  {video.channel?.channelName || 'Unknown Channel'}
                </Link>
                <p className="text-sm text-gray-400">
                  {video.channel?.subscribers?.toLocaleString() || '0'} subscribers
                </p>
              </div>
              <button className="ml-4 bg-white hover:bg-gray-700 text-black px-4 py-2 rounded-full">
                Subscribe
              </button>
            </div>

            {/* Like/Dislike/Share Buttons */}
            <div className="flex items-center gap-3">
              <div className="flex bg-white/10 rounded-full p-1">
                <button 
                  onClick={handleLike}
                  className="flex items-center gap-2 px-4 py-2 rounded-l-full hover:bg-white/20"
                >
                  {isLike ? <BiSolidLike size={20} /> : <BiLike size={20} />}
                  {likes.toLocaleString()}
                </button>
                <div className="w-px h-6 bg-white/20" />
                <button 
                  onClick={handleDislike}
                  className="px-4 py-2 rounded-r-full hover:bg-white/20"
                >
                  {isDisLike ? <BiSolidDislike size={20} /> : <BiDislike size={20} />}
                </button>
              </div>
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full"
              >
                <FaShare size={16} /> Share
              </button>
            </div>
          </div>

          {/* Video Description */}
          <div className="bg-white/5 rounded-xl p-4 relative">
            <p className={`text-gray-300 ${expandDesc ? '' : 'line-clamp-2'}`}>
              {video.views.toLocaleString()} views<br />
              {video.description}
            </p>
            <button 
              onClick={() => setExpandDesc(!expandDesc)}
              className="text-blue-400 hover:text-blue-300 font-medium mt-2"
            >
              {expandDesc ? 'Show less' : 'Show more'}
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <CommentSection videoId={videoId} />
      </div>

      {/* Recommendations Sidebar */}
      <div className="w-full lg:w-1/3 lg:overflow-y-auto lg:sticky lg:top-20">
        <RecommendationVideo currentVideoId={videoId} />
      </div>
    </div>
  );
}
