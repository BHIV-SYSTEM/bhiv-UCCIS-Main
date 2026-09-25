import ReplayTable from
"../components/ReplayTable";

function ReplayView({
  replay
}) {

  return (
    <div>

      <h2>
        Replay Events
      </h2>

      <ReplayTable
        replays={replay}
      />

    </div>
  );

}

export default ReplayView;