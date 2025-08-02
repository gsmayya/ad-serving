import FeedItem from '../components/FeedItem';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function HomePage() {
  const [feedContent, setFeedContent] = useState([]);
  const [adContent, setAdContent] = useState(null);

  useEffect(() => {
    const fetchFeed = async () => {
      const payload = {
        time: new Date().toISOString(),
        pagetype: 'news-feed',
        uuid: uuidv4(),
      };

      try {
        const res = await fetch('/api/fetchContent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (data?.htmlContent) {
          setFeedContent((prev) => [...prev, data.htmlContent]);
        }
      } catch (error) {
        console.error('Error fetching feed:', error);    
      }
    };

    const fetchAd = async () => {
      const payload = {
        time: new Date().toISOString(),
        pagetype: 'sidebar-ad',
        uuid: uuidv4(),
      };

      try {
        const res = await fetch('/api/fetchContent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (data?.htmlContent) {
          setAdContent(data.htmlContent);
        }
      } catch (error) {
        console.error('Error fetching ad:', error);    
      }
    };

    fetchFeed();
    fetchAd();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 flex gap-8 items-start">
      {/* Main Feed */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-center mb-4">News Feed</h1>
        {feedContent.map((html, idx) => (
          <FeedItem key={idx} html={html} />
        ))}
      </div>
      {/* Sidebar */}
      <aside className="w-80 bg-gray-50 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Sponsored</h2>
        {adContent ? <FeedItem html={adContent} /> : <div>Loading ad...</div>}
      </aside>
    </div>
  );
}
