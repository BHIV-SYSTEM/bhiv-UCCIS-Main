import SignalTable from
"../components/SignalTable";

function SignalsView({
  signals
}) {

  return (
    <div>
      <h2>
        Active Signals
      </h2>

      <SignalTable
        data={signals}
      />
    </div>
  );

}

export default SignalsView;