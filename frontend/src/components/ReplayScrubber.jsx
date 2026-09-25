import { useState } from "react";

export default function ReplayScrubber({ timeline }) {

  const [index, setIndex] = useState(0);

  return (
    <div>

      <h3>REPLAY SCRUBBER</h3>

      <input
        type="range"
        min="0"
        max={timeline?.length - 1 || 0}
        value={index}
        onChange={(e) => setIndex(e.target.value)}
      />

      <pre>
        {JSON.stringify(timeline?.[index], null, 2)}
      </pre>

    </div>
  );
}