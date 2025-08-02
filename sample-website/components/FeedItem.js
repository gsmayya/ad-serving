import React from 'react';

export default function FeedItem({ html }) {
  return (
    <div className="mb-6 p-4 bg-white rounded shadow flex">
      <div className="flex-1" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
