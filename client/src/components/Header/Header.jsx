import { Link, useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { useSearch } from "../../context/SearchContext";
import { useAuth } from "../../context/AuthContext";
import { BiSearch } from "react-icons/bi";
import { LuCircleUserRound } from "react-icons/lu";
import { useSidebar } from "../../context/SidebarContext";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Header() {
  const { searchQuery, setSearchQuery } = useSearch();
  const { user, logout } = useAuth();
  const { toggleSidebar } = useSidebar();
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Handle click outside for dropdown menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownMenu(false);
      }
    }

    if (dropdownMenu) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [dropdownMenu]);

  // Handle Enter key press or click in search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      await axios.get(
        `${API_BASE_URL}/search?q=${encodeURIComponent(searchQuery)}`
      );
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    } catch (error) {
      console.error("Error searching videos:", error);
    }
  };

  return (
    <header className="bg-[#0f0f0f] text-white p-4 flex items-center justify-between fixed w-full top-0 z-50 shadow-lg">
      {/* Left - Hamburger & Logo */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-700 rounded-full transition-colors cursor-pointer"
        >
          <FiMenu className="w-6 h-6 text-white" />
        </button>
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.png" className="h-8 w-8" alt="logo" />
          <span className="text-xl font-medium tracking-tighter text-white-600">
            YouTube
          </span>
        </Link>
      </div>

      {/* Center - Search Bar */}
      <div className="flex-1 max-w-2xl mx-4">
        <div className="relative group flex items-center">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full px-4 py-2 bg-[#0f0f0f] text-white rounded-full 
              border-y-2 border-l-2 border-gray-700 placeholder-gray-400 
              focus:outline-none focus:ring-0 group-hover:border-red-600"
          />
          <button
            onClick={handleSearch}
            className="absolute right-0 h-full cursor-pointer px-4 bg-[#181818] rounded-r-full flex items-center justify-center border-2 border-gray-700 group-hover:border-red-600"
          >
            <BiSearch className="text-white" size={20} />
          </button>
        </div>
      </div>

      {/* Right - User Auth */}
      <div className="flex items-center space-x-4">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <img
              src={user?.channels?.channelLogo || "/user.png"}
              alt="user"
              onClick={() => setDropdownMenu(!dropdownMenu)}
              className="w-10 rounded-full cursor-pointer"
            />

            {dropdownMenu && (
              <div className="absolute top-12 right-12 w-84 rounded-lg p-4 bg-[#282828]">
                <div className="flex items-start justify-between flex-col gap-4">
                  <div className="flex items-start gap-2">
                    <img
                      src={user?.channels?.channelLogo || "/user.png"}
                      alt="user"
                      className="w-14 rounded-full cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="text-lg font-medium">
                        {user.username}
                      </span>
                      <span className="text-sm font-medium">{user.email}</span>
                      <Link
                        to={`/channel/${user?.channels?._id}`}
                        className="text-sm font-normal hover:underline mt-4 text-sky-400"
                      >
                        View your channel
                      </Link>
                    </div>
                  </div>
                  <hr className="border-gray-500 w-full" />
                  <button
                    onClick={logout}
                    className="bg-red-600 w-full hover:bg-red-700 px-4 py-2 rounded-full 
                      text-sm font-medium transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/auth"
            className="flex gap-2 items-center border-2 border-red-600 bg-red-600/20 hover:bg-red-600/60 px-4 py-2 rounded-full 
              text-sm font-medium transition-colors"
          >
            <LuCircleUserRound size={20} />
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
