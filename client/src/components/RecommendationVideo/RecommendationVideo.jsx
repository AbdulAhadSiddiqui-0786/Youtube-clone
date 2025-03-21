import { useEffect, useState } from "react";
import VerticalVideoCard from "../VerticalVideoCard/VerticalVideoCard";
import axios from "axios";

const RecommendationVideo = () => {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/videos');
                const shuffledVideos = shuffleArray(response.data.videos); // Shuffle the videos
                setVideos(shuffledVideos);
            } catch (error) {
                console.error('Error fetching videos:', error);
            }
        };

        fetchVideos();
    }, []); // Remove `videos` from the dependency array to avoid infinite loops

    // Function to shuffle an array using the Fisher-Yates algorithm
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