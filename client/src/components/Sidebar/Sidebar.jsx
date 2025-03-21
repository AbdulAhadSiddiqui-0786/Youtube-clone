import { Link } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import { MdOutlineSubscriptions, MdWatchLater } from "react-icons/md";
import { IoMusicalNotesOutline } from "react-icons/io5";
import { SiYoutubegaming, SiYoutubeshorts } from "react-icons/si";
import { FaHistory, FaFire, FaShoppingBag, FaMusic, FaFilm, FaBroadcastTower, FaGamepad, FaNewspaper, FaRunning, FaBookOpen, FaTshirt, FaPodcast } from "react-icons/fa";
import { PiPlaylistDuotone } from "react-icons/pi";
import { BiSolidVideos, BiSolidLike } from "react-icons/bi";
import { useSidebar } from "../../context/SidebarContext";

export default function Sidebar() {
  const { isSidebarOpen } = useSidebar();

  return (
    <aside
      className={`${isSidebarOpen ? "w-64" : "w-0"} 
      bg-[#0f0f0f] h-screen fixed overflow-y-auto transition-all duration-300 z-50
      transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
      pt-16 border-r border-gray-700`}
    >
      <div className="p-4 space-y-4">
        {/* Home, Shorts, Subscriptions */}
        <Link to="/" className="flex items-center gap-2 text-white hover:bg-gray-700 w-full text-left p-2 rounded-md">
          <FiHome size={20} />
          Home
        </Link>
        <Link to="/shorts" className="flex items-center gap-2 text-white hover:bg-gray-700 w-full text-left p-2 rounded-md">
          <SiYoutubeshorts size={20} />
          Shorts
        </Link>
        <Link to="/feed/subscriptions" className="flex items-center gap-2 text-white hover:bg-gray-700 w-full text-left p-2 rounded-md">
          <MdOutlineSubscriptions size={20} />
          Subscriptions
        </Link>

        {/* You Section */}
        <div className="border-t border-gray-700 pt-4">
          <h3 className="text-gray-400 text-sm font-bold px-2">You</h3>
          <div className="mt-2 space-y-2">
            <Link to="/history" className="flex items-center gap-2 text-white hover:bg-gray-700 w-full text-left p-2 rounded-md">
              <FaHistory size={20} />
              History
            </Link>
            <Link to="/playlist" className="flex items-center gap-2 text-white hover:bg-gray-700 w-full text-left p-2 rounded-md">
              <PiPlaylistDuotone size={20} />
              Playlist
            </Link>
            <Link to="/your-videos" className="flex items-center gap-2 text-white hover:bg-gray-700 w-full text-left p-2 rounded-md">
              <BiSolidVideos size={20} />
              Your Videos
            </Link>
            <Link to="/watch-later" className="flex items-center gap-2 text-white hover:bg-gray-700 w-full text-left p-2 rounded-md">
              <MdWatchLater size={20} />
              Watch Later
            </Link>
            <Link to="/liked-videos" className="flex items-center gap-2 text-white hover:bg-gray-700 w-full text-left p-2 rounded-md">
              <BiSolidLike size={20} />
              Liked Videos
            </Link>
          </div>
        </div>

        {/* Explore Section */}
        <div className="border-t border-gray-700 pt-4">
          <h3 className="text-gray-400 text-sm font-bold px-2">Explore</h3>
          <div className="mt-2 space-y-2">
            <Link to="/trending" className="flex items-center gap-2 text-white hover:bg-gray-700 w-full text-left p-2 rounded-md">
              <FaFire size={20} />
              Trending
            </Link>
            <Link to="/shopping" className="flex items-center gap-2 text-white hover:bg-gray-700 w-full text-left p-2 rounded-md">
              <FaShoppingBag size={20} />
              Shopping
            </Link>
            <Link to="/music" className="flex items-center gap-2 text-white hover:bg-gray-700 w-full text-left p-2 rounded-md">
              <FaMusic size={20} />
              Music
            </Link>
            <Link to="/films" className="flex items-center gap-2 text-white hover:bg-gray-700 w-full text-left p-2 rounded-md">
              <FaFilm size={20} />
              Films
            </Link>
            <Link to="/live" className="flex items-center gap-2 text-white hover:bg-gray-700 w-full text-left p-2 rounded-md">
              <FaBroadcastTower size={20} />
              Live
            </Link>
            <Link to="/gaming" className="flex items-center gap-2 text-white hover:bg-gray-700 w-full text-left p-2 rounded-md">
              <FaGamepad size={20} />
              Gaming
            </Link>
            <Link to="/news" className="flex items-center gap-2 text-white hover:bg-gray-700 w-full text-left p-2 rounded-md">
              <FaNewspaper size={20} />
              News
            </Link>
            <Link to="/sport" className="flex items-center gap-2 text-white hover:bg-gray-700 w-full text-left p-2 rounded-md">
              <FaRunning size={20} />
              Sport
            </Link>
            <Link to="/courses" className="flex items-center gap-2 text-white hover:bg-gray-700 w-full text-left p-2 rounded-md">
              <FaBookOpen size={20} />
              Courses
            </Link>
            <Link to="/fashion" className="flex items-center gap-2 text-white hover:bg-gray-700 w-full text-left p-2 rounded-md">
              <FaTshirt size={20} />
              Fashion & Beauty
            </Link>
            <Link to="/podcasts" className="flex items-center gap-2 text-white hover:bg-gray-700 w-full text-left p-2 rounded-md">
              <FaPodcast size={20} />
              Podcasts
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
