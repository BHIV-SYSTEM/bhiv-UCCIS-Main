function DashboardHeaderTask34() {
  const currentDate =
    new Date().toLocaleString();

  return (
    <div className="dashboard-header">
      <div>
        <h1>
          UCCIS Command Center
        </h1>

        <p>
          Unified Command Center
          Intelligence System
        </p>
      </div>

      <div>
        {/* <h4>{currentDate}</h4> */}
      </div>
    </div>
  );
}

export default DashboardHeaderTask34;