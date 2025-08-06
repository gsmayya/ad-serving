import NewsFeed from '../components/NewsFeed';
import SidebarAd from '../components/SidebarAd';

export default function HomePage() {
  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 flex flex-row gap-8 items-start">
      {/* News Feed - Left */}
      <div className="w-2/3 flex flex-col">
        <NewsFeed />
      </div>
      {/* Sidebar Ad - Right */}
      <aside className="w-1/3 flex flex-col">
        <SidebarAd />
      </aside>
    </div>
  );
}