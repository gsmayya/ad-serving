import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import FeedItem from './FeedItem';

export default function NewsFeed() {
  const [feedContent, setFeedContent] = useState<string[]>([]);

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
          setFeedContent((prev) => [...prev, data.htmlContent as string]);
        }
      } catch (error) {
        console.error('Error fetching feed:', error);
      }
    };

    fetchFeed();
  }, []);

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold text-center mb-4">News Feed</h1>
      {feedContent.length === 0 ? (
        <div className="text-center text-gray-500">Loading news...</div>
      ) : (
        feedContent.map((html, idx) => (
          <FeedItem key={idx} html={html} />
        ))
      )}
    </div>
  );
}