import { useEffect, useState } from "react";
import VerticalVideoCard from "../VerticalVideoCard/VerticalVideoCard";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const RecommendationVideo = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/videos`);
        const shuffledVideos = shuffleArray(response.data.videos); // Shuffle videos
        setVideos(shuffledVideos);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  // Fisher-Yates shuffle
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  return (
    <div className="flex flex-col w-full gap-4">
      {videos.map((video) => (
        <VerticalVideoCard key={video._id} video={video} />
      ))}
    </div>
  );
};

export default RecommendationVideo;
