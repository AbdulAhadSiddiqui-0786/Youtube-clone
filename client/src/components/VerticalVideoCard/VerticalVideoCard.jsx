import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function SmallVideoCard({ video }) {
  const { user } = useAuth();
  const isCurrentUserChannel = video.channel?.user === user?._id;

  // Thumbnail handling
  const isAbsoluteUrl = video?.thumbnailUrl?.startsWith('http');
  const thumbnailUrl = isAbsoluteUrl
    ? video.thumbnailUrl
    : `http://localhost:5000${video.thumbnailUrl}`;

  return (
    <div className="flex gap-2 hover:bg-[#ffffff0d] p-2 rounded-xl transition-colors">
      {/* Thumbnail */}
      <Link 
        to={`/watch/${video._id}`} 
        className="flex-shrink-0 w-40 h-24 relative"
      >
        <img
          src={thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover rounded-xl"
          onError={(e) => {
            e.target.src = '/placeholder-thumbnail.jpg';
          }}
        />
      </Link>

      {/* Video Info */}
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <h3 className="text-white font-medium text-sm line-clamp-2">
          {video.title || 'Untitled Video'}
        </h3>
        
        <Link
          to={isCurrentUserChannel ? `/channel/${video.channel?.user}` : `/channel/${video.channel?._id}`}
          className="text-xs text-[#aaa] hover:text-white line-clamp-1"
        >
          {video.channel?.channelName || 'Unknown Channel'}
        </Link>
        
        <div className="text-xs text-[#aaa] flex items-center gap-1">
          <span>{video.views?.toLocaleString() || '0'} views</span>
          <span>•</span>
          <span>2 days ago</span> {/* Replace with actual timestamp */}
        </div>
      </div>
    </div>
  );
}