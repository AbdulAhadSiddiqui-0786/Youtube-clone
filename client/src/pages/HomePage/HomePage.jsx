import { useEffect, useState } from 'react';
import VideoCard from '../../components/VideoCard/VideoCard';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import FilterButtons from '../../components/FilterButtons/FilterButtons';
import { useSidebar } from '../../context/SidebarContext';

// Shuffle function
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default function HomePage() {
  const [videos, setVideos] = useState([]);  // Ensure videos starts as an array
  const { isSidebarOpen, setIsSidebarOpen, openSidebar } = useSidebar();
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetch('http://localhost:5000/api/videos')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.videos)) {
          const shuffledVideos = shuffleArray(data.videos);  // Shuffle the videos
          setVideos(shuffledVideos);  // Set the shuffled videos
        } else {
          console.error("API did not return an array:", data);
          setVideos([]);  // Prevents map() error
        }
      })
      .catch((err) => {
        console.error('Error fetching videos:', err);
        setVideos([]);  // Handle errors gracefully
      });

    if (isSidebarOpen === false) {
      openSidebar();
    }
  }, [isSidebarOpen, openSidebar]);

  const filteredVideos = selectedCategory === 'All'
    ? videos
    : videos.filter(video => video.category === selectedCategory);

  return (
    <div className="min-h-screen">
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex pt-16">
        <Sidebar isOpen={isSidebarOpen} />

        <main className={`overflow-y-auto flex-1 p-4 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <FilterButtons selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

          {filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2">
              {filteredVideos.map((video) => (
                <VideoCard
                  key={video._id}
                  video={video}
                  channelName={video?.channel ? video?.channel?.name : "Unknown Channel"} //  Show actual channel name
                  channelImage={video?.channel ? video?.channel?.profileImage : "/default-user.png"} 
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center mt-10">No videos found.</p>
          )}
        </main>
      </div>
    </div>
  );
}