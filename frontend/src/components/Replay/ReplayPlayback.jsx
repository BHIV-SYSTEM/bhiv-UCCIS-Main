export default function ReplayPlayback() {

  return (
    <div className="replay-panel playback-panel">

      <div className="replay-panel-header">
        TIMELINE PLAYBACK
      </div>

      <div className="playback-screen">

        <div className="playback-stage active-stage">
          INCIDENT ACTIVE
        </div>

        <div className="playback-stage">
          FIELD RESPONSE
        </div>

        <div className="playback-stage">
          ACKNOWLEDGEMENT
        </div>

        <div className="playback-stage">
          RESOLUTION
        </div>

      </div>

    </div>
  );
}