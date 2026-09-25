// import CanonicalPlatform from "../layout/CanonicalPlatform";
import EvidencePanel from "../components/EvidencePanel";
import EvidenceChart from "../components/EvidenceChart";
import EvidenceTableTask34 from "../components/EvidenceTableTask34";

function Evidence() {
  return (
    // <CanonicalPlatform>
      <div className="page-container">

        <EvidencePanel />

        <EvidenceChart />

        <EvidenceTableTask34 />

      </div>
    // </CanonicalPlatform>
  );
}

export default Evidence;