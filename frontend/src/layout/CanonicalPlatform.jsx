import MainLayoutTask34 from "../layout/MainLayoutTask34";
import SummaryCardsTask34 from "../components/SummaryCardsTask34";
import RuntimeMetricsChartTask34 from "../components/RuntimeMetricsChartTask34";
import SystemHealthTask34 from "../components/SystemHealthTask34";
import RecentActivity from "../components/RecentActivity";
import RuntimeLogsTask34 from "../components/RuntimeLogsTask34";

function CanonicalPlatform() {
  return (
    <MainLayoutTask34>
      <div className="page-container">

        <SummaryCardsTask34 />

        <RuntimeMetricsChartTask34 />

        <SystemHealthTask34 />

        <RecentActivity />

        <RuntimeLogsTask34 />

      </div>
    </MainLayoutTask34>
  );
}

export default CanonicalPlatform;