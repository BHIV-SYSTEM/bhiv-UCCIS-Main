// import CanonicalPlatform from "../layout/CanonicalPlatform";

import SignalPanel from "../components/SignalPanel";
import SignalChartTask34 from "../components/SignalChartTask34";
import SignalTableTask34 from "../components/SignalTableTask34";

function Signals() {
  return (
    // <CanonicalPlatform>
      <div className="page-container">

        <SignalPanel />

        <SignalChartTask34 />

        <SignalTableTask34 />

      </div>
    // </CanonicalPlatform>
  );
}

export default Signals;