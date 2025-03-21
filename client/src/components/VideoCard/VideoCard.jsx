import { Link, Links, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function VideoCard({ video }) {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get the current user from the AuthContext
  const pathname = window.location.href;

  // Determine if the channel belongs to the current user
  const isCurrentUserChannel = video.channel?.user === user?._id;

  // Handle channel name click
  const handleChannelClick = () => {
    if (isCurrentUserChannel) {
      navigate(`/channel/${video.channel?.user}`); // Navigate to the current user's channel
    } else {
      navigate(`/channel/${video.channel?._id}`); // Navigate to the other channel
    }
  };

  // Default values for missing data
  const title = video.title || 'Untitled Video';
  const channelName = video.channel?.channelName || 'Unknown Channel';
  const views = video.views?.toLocaleString() || '0';

  return (
    <div className="bg-[#0f0f0f] rounded-lg group overflow-hidden transition-transform duration-200">
      <Link to={`/watch/${video._id}`}>
        <img
          src={video?.thumbnailUrl}
          alt={title}
          className="w-full h-50 rounded-lg group-hover:scale-[1.02] transition-transform duration-200 object-cover bg-gray-700"
          onError={(e) => {
            e.target.src = '/placeholder-thumbnail.jpg';
          }}
        />
      </Link>
      <div className="p-3">
        <h3 className="font-semibold text-white truncate">{title}</h3>
        <div className="mt-2 text-sm text-gray-400">
          {/* Conditionally render channel link */}
          {!pathname.includes('/channel') && (
            <Link
              to={`/channel/${video.channel?._id}`}
              onClick={handleChannelClick}
              className="truncate text-left hover:underline"
            >
              {channelName}
            </Link>
          )}
          <div className="flex items-center mt-1">
            <span>{views} views</span>
          </div>
        </div>
      </div>
    </div>
  );
}