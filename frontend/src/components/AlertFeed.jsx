export default function AlertFeed({ feed }) {
  return (
    <div className="panel feed">

      <div className="panel-title">
        Live Governance Feed
      </div>

      <ul className="feed-list">
        {feed.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

    </div>
  );
}