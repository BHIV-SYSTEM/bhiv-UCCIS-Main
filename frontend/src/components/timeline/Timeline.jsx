export default function Timeline({
  items
}) {
  return (
    <div className="timeline">

      {items.map((item) => (
        <div
          className="timeline-item"
          key={item.id}
        >
          <h4>{item.title}</h4>

          <p>{item.time}</p>

          <span>
            {item.status}
          </span>
        </div>
      ))}

    </div>
  );
}