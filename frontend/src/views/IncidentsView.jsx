import IncidentTable from
"../components/IncidentTable";

function IncidentsView({
  incidents
}) {

  return (
    <div>

      <h2>
        Active Incidents
      </h2>

      <IncidentTable
        incidents={incidents}
      />

    </div>
  );

}

export default IncidentsView;