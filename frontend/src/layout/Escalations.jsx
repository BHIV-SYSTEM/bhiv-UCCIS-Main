// import CanonicalPlatform from "../layout/CanonicalPlatform";
import EscalationPanel from "../components/EscalationPanel";
import EscalationChart from "../components/EscalationChart";
import EscalationTableTask34 from "../components/EscalationTableTask34";

function Escalations() {
  return (
    // <CanonicalPlatform>
      <div className="page-container">

        <EscalationPanel />

        <EscalationChart />

        <EscalationTableTask34 />

      </div>
    // </CanonicalPlatform>
  );
}

export default Escalations;