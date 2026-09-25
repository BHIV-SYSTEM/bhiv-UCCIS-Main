// import CanonicalPlatform from "../layout/CanonicalPlatform";
import IncidentPanel from "../components/IncidentPanel";
import IncidentChartTask34 from "../components/IncidentChartTask34";
import IncidentTableTask34 from "../components/IncidentTableTask34";

function Incidents() {
  return (
    // <CanonicalPlatform>
      <div className="page-container">

        <IncidentPanel />

        <IncidentChartTask34 />

        <IncidentTableTask34 />

      </div>
    // </CanonicalPlatform>
  );
}

export default Incidents;