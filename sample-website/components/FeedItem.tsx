import React from 'react';

interface FeedItemProps {
  html: string;
}

const FeedItem: React.FC<FeedItemProps> = ({ html }) => {
  return (
    <div className="mb-6 p-4 bg-white rounded shadow flex">
      <div className="flex-1" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

export default FeedItem;