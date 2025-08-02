// components/FeedItem.js
export default function FeedItem({ html }) {
  return (
    <div
      className="bg-white border rounded p-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
