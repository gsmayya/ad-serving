import FeedItem from '../components/FeedItem';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function HomePage() {
  const [feedContent, setFeedContent] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
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

    fetchContent();
  }, []);


  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-center mb-4">News Feed</h1>
      {feedContent.map((html, idx) => (
        <FeedItem key={idx} html={html} />
      ))}
    </div>
  );
}
