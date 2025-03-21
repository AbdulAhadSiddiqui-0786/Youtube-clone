import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import VideoPlayerPage from './pages/VideoPlayerPage/VideoPlayerPage';
import AuthPage from './pages/AuthPage/AuthPage';
import ChannelPage from './pages/ChannelPage/ChannelPage';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import NextTopLoader from 'nextjs-toploader';
import { SidebarProvider } from './context/SidebarContext';
import Search from './pages/Search/Search';

export default function App() {
  return (
    <SidebarProvider>
      <div className="min-h-screen  text-white flex">
        <Sidebar /> {/* Universal Sidebar */}
        <div className="flex-1">
          <NextTopLoader
            color="#ff003c"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #b5002a,0 0 5px #ff003c"
            template='<div class="bar" role="bar"><div class="peg"></div></div> 
  <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
            zIndex={1600}
            showAtBottom={false}
          />
          <Header /> {/* Universal Header */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/watch/:videoId" element={<VideoPlayerPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/search" element={<Search />} />
            <Route path="/channel/:channelId" element={<ChannelPage />} />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </div>
      </div>
    </SidebarProvider>
  );
}
