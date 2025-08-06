import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import FeedItem from './FeedItem';

export default function SidebarAd() {
  const [adContent, setAdContent] = useState<string | null>(null);

  useEffect(() => {
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
          setAdContent(data.htmlContent as string);
        }
      } catch (error) {
        console.error('Error fetching ad:', error);
      }
    };

    fetchAd();
  }, []);

  return (
    <aside className="bg-gray-50 p-4 rounded shadow flex flex-col min-h-[300px]">
      <h2 className="text-xl font-semibold mb-2">Sponsored</h2>
      {adContent ? <FeedItem html={adContent} /> : <div>Loading ad...</div>}
    </aside>
  );
}