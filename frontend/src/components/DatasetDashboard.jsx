import { useEffect, useState } from "react";
import DatasetCard from "../components/DatasetCard";
import DatasetTable from "../components/DatasetTable";

const datasets = [
  "departments",
  "districts",
  "signals",
  "operators",
  "telemetry",
  "escalations",
  "replay_events",
  "approvals",
  "runtime_states"
];

function DatasetDashboard() {
  const [data, setData] = useState({});
  const [selected, setSelected] = useState("departments");

  useEffect(() => {
    datasets.forEach(async (dataset) => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/datasets/${dataset}`
        );

        const result = await res.json();

        setData((prev) => ({
          ...prev,
          [dataset]: result.data || []
        }));
      } catch (err) {
        console.error(err);
      }
    });
  }, []);

  return (
    <div className="dashboard">
      <h1>UCCIS Dataset Realism Dashboard</h1>

      <div className="card-grid">
        {datasets.map((item) => (
          <DatasetCard
            key={item}
            title={item}
            count={data[item]?.length || 0}
            onClick={() => setSelected(item)}
          />
        ))}
      </div>

      <DatasetTable
        title={selected}
        rows={data[selected] || []}
      />
    </div>
  );
}

export default DatasetDashboard;