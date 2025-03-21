import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import VideoCard from '../../components/VideoCard/VideoCard';

export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/search?q=${encodeURIComponent(query)}`);
                setVideos(response.data.videos);
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        };

        if (query) {
            fetchSearchResults();
        }
    }, [query]);
    return (
        <div className='mt-20 p-12'>
            <h1 className='text-2xl font-bold mb-4'>Search Results for: <span className='text-red-400'>{query}</span></h1>
            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-12'>
                {videos.length > 0 ? (
                    videos.map((video) => (
                        <VideoCard key={video._id} video={video} />
                    ))
                ) : (
                    <p>No videos found.</p>
                )}
            </div>
        </div>
    );
}