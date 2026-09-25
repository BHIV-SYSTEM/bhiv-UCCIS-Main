// import CanonicalPlatform from "../layout/CanonicalPlatform";
import ObservabilityPanel from "../components/ObservabilityPanel";
import ObservabilityChart from "../components/ObservabilityChart";
import ObservabilityTable from "../components/ObservabilityTable";

function Observability() {
  return (
    // <CanonicalPlatform>
      <div className="page-container">

        <ObservabilityPanel />

        <ObservabilityChart />

        <ObservabilityTable />

      </div>
    // </CanonicalPlatform>
  );
}

export default Observability;