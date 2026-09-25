import RuntimeHealthCard from
"../components/RuntimeHealthCard";

function HealthView({
  health
}) {

  return (
    <div>

      <h2>
        Runtime Health
      </h2>

      <RuntimeHealthCard
        health={health}
      />

    </div>
  );

}

export default HealthView;