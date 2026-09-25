export default function ReplayTimelineTask15({ timeline }) {

  return (
    <div>

      <h3>REPLAY TIMELINE</h3>

      {timeline?.map((item, index) => (

        <div key={index} className="timeline-row">

          <span>{item.event.type}</span>

          <span>
            {new Date(item.event.timestamp).toLocaleTimeString()}
          </span>

        </div>

      ))}

    </div>
  );
}