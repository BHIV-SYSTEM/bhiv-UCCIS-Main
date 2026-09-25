import { useEffect, useState } from "react";

import axios from "axios";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from "recharts";

import StatusCard from "../components/Cards/StatusCard";

import AnalyticsCard from "../components/Cards/AnalyticsCard";

import BackendResponseCard from "../components/Cards/BackendResponseCard";

/* ========================================================= */
/* GOVERNANCE EXECUTION DATA                                 */
/* ========================================================= */

const executionData = [

  {
    district: "Mumbai",
    execution: 92
  },

  {
    district: "Pune",
    execution: 84
  },

  {
    district: "Nagpur",
    execution: 76
  },

  {
    district: "Nashik",
    execution: 69
  },

  {
    district: "Satara",
    execution: 58
  }

];

/* ========================================================= */
/* GOVERNANCE RISK DATA                                      */
/* ========================================================= */

const riskData = [

  {
    name: "Low Risk",
    value: 54
  },

  {
    name: "Medium Risk",
    value: 31
  },

  {
    name: "Critical Risk",
    value: 15
  }

];

const riskColors = [

  "#00d084",
  "#f59e0b",
  "#ef4444"

];

/* ========================================================= */
/* BUDGET IMPACT DATA                                        */
/* ========================================================= */

const budgetData = [

  {
    sector: "Health",
    budget: 84
  },

  {
    sector: "Infrastructure",
    budget: 74
  },

  {
    sector: "Disaster",
    budget: 66
  },

  {
    sector: "Transport",
    budget: 58
  },

  {
    sector: "Education",
    budget: 71
  }

];

/* ========================================================= */
/* COMPONENT                                                 */
/* ========================================================= */

export default function Governance() {

  const [backendData, setBackendData] = useState({});

  /* ======================================================= */
  /* FETCH BACKEND                                           */
  /* ======================================================= */

  useEffect(() => {

    axios
      .get("http://localhost:5000/api/governance")
      .then((res) => {

        setBackendData(res.data);

      })
      .catch((err) => {

        console.log(err);

      });

  }, []);

  /* ======================================================= */
  /* UI                                                      */
  /* ======================================================= */

  return (

    <div className="page-layout">

      {/* =================================================== */}
      {/* PAGE HEADER                                         */}
      {/* =================================================== */}

      <div className="page-title-section">

        <div>

          <h1 className="page-title">

            GOVERNANCE CONTROL CENTER

          </h1>

          <p className="page-subtitle">

            Statewide governance visibility, escalation tracking,
            execution monitoring, operational bottleneck analysis,
            budget impact intelligence, and institutional oversight.

          </p>

        </div>

        {/* <div className="page-live-status">

          ● GOVERNANCE ACTIVE

        </div> */}

      </div>

      {/* =================================================== */}
      {/* TICKER                                              */}
      {/* =================================================== */}

      <div className="command-ticker">

        <div className="ticker-item success">

          Governance synchronization operational

        </div>

        <div className="ticker-item warning">

          Budget escalation threshold exceeded

        </div>

        <div className="ticker-item critical">

          Critical operational bottleneck detected

        </div>

        <div className="ticker-item">

          Monitoring 42 active governance workflows

        </div>

      </div>

      {/* =================================================== */}
      {/* KPI STRIP                                           */}
      {/* =================================================== */}

      <div className="kpi-strip">

        <StatusCard
          title="ACTIVE GOVERNANCE"
          value="42"
          status="Statewide governance monitoring active"
          type="primary"
        />

        <StatusCard
          title="ESCALATIONS"
          value="11"
          status="Operational escalation load elevated"
          type="danger"
        />

        <StatusCard
          title="EXECUTION HEALTH"
          value="89%"
          status="Execution governance stable"
          type="success"
        />

        <StatusCard
          title="RISK INDEX"
          value="MEDIUM"
          status="Governance risk pressure active"
          type="warning"
        />

      </div>

      {/* =================================================== */}
      {/* MAIN GRID                                           */}
      {/* =================================================== */}

      <div className="governance-grid">

        {/* ================================================= */}
        {/* LEFT COLUMN                                       */}
        {/* ================================================= */}

        <div className="governance-left-column">

          <AnalyticsCard
            title="GOVERNANCE STABILITY"
            metric="91%"
            change="+8%"
            description="Institutional governance coordination improved across operational corridors."
            type="success"
          />

          <AnalyticsCard
            title="ESCALATION PRESSURE"
            metric="14"
            change="+5%"
            description="Escalation backlog increasing in district execution chains."
            type="danger"
          />

          {/* <BackendResponseCard
            title="GOVERNANCE BACKEND RESPONSE"
            data={backendData}
          /> */}

        </div>

        {/* ================================================= */}
        {/* CENTER COLUMN                                     */}
        {/* ================================================= */}

        <div className="governance-center-column">

          {/* ============================================= */}
          {/* EXECUTION ANALYTICS                           */}
          {/* ============================================= */}

          <div className="chart-box large-chart">

            <div className="chart-title execution-chart-title">

              GOVERNANCE EXECUTION ANALYTICS

            </div>

            <ResponsiveContainer width="100%" height={300}>

              <BarChart data={executionData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#233142"
                />

                <XAxis
                  dataKey="district"
                  stroke="#8ea2b8"
                  label={{
    value: "Districts",
    position: "insideBottom",
    offset: -5,
    fill: "#d6dde5",
    fontSize: 14,
  }}
                />

                <YAxis
                  stroke="#8ea2b8"
                  label={{
                    value: "Execution Rate (%)",
    angle: -90,
    position: "insideLeft",
    fill: "#d6dde5",
    fontSize: 14,
                  }}
                />

                <Tooltip
                  formatter={(value) => [`${value}%`, "Execution"]}
                  contentStyle={{
                    backgroundColor: "#141d28",
                    border: "1px solid #223041",
                    color: "#ffffff"
                  }}
                />

                <Legend
                  verticalAlign="top"
                  height={36}
                  wrapperStyle={{
                    color: "#d6dde5",
                    fontSize: "12px"
                  }}
                />

                <defs>

                  <linearGradient
                    id="governanceExecutionGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      stopColor="#3b82f6"
                    />

                    <stop
                      offset="100%"
                      stopColor="#1d4ed8"
                    />

                  </linearGradient>

                </defs>

                <Bar
                  dataKey="execution"
                  fill="url(#governanceExecutionGradient)"
                  radius={[8, 8, 0, 0]}
                  name="Execution %"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

          {/* ============================================= */}
          {/* BUDGET IMPACT ANALYTICS                       */}
          {/* ============================================= */}

          <div className="chart-box large-chart">

            <div className="chart-title">

              BUDGET IMPACT ANALYTICS

            </div>

            <ResponsiveContainer width="100%" height={300}>

              <BarChart data={budgetData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#233142"
                />

                <XAxis
                  dataKey="sector"
                  stroke="#8ea2b8"
                  label={{
    value: "Government Sectors",
    position: "insideBottom",
    offset: -5,
    fill: "#d6dde5",
    fontSize: 14,
  }}
                />

                <YAxis
                  stroke="#8ea2b8"
                  label={{
    value: "Budget Utilization (%)",
    angle: -90,
    position: "insideLeft",
    fill: "#d6dde5",
    fontSize: 14,
  }}
                />

                <Tooltip
                  formatter={(value) => [`${value}%`, "Budget"]}
                  contentStyle={{
                    backgroundColor: "#141d28",
                    border: "1px solid #223041",
                    color: "#ffffff"
                  }}
                />

                <Legend
                  verticalAlign="top"
                  height={36}
                  wrapperStyle={{
                    color: "#d6dde5",
                    fontSize: "12px"
                  }}
                />

                <defs>

                  <linearGradient
                    id="budgetGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      stopColor="#00d084"
                    />

                    <stop
                      offset="100%"
                      stopColor="#0f766e"
                    />

                  </linearGradient>

                </defs>

                <Bar
                  dataKey="budget"
                  fill="url(#budgetGradient)"
                  radius={[8, 8, 0, 0]}
                  name="Budget %"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* ================================================= */}
        {/* RIGHT COLUMN                                      */}
        {/* ================================================= */}

        <div className="governance-right-column">

          {/* ============================================= */}
          {/* RISK DISTRIBUTION                             */}
          {/* ============================================= */}

          <div className="chart-box">

            <div className="chart-title">

              GOVERNANCE RISK DISTRIBUTION

            </div>

            <ResponsiveContainer width="100%" height={280}>

              <PieChart>

                <Pie
                  data={riskData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  innerRadius={50}

                  label={({ percent }) =>
                    `${(percent * 100).toFixed(0)}%`
                  }
                >

                  {riskData.map((entry, index) => (

                    <Cell
                      key={index}
                      fill={riskColors[index]}
                    />

                  ))}

                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#141d28",
                    border: "1px solid #526174",
                    color: "#ffffff"
                  }}
                  labelStyle={{
                    color: "#ffffff"
                  }}
                  itemStyle={{
                    color: "#ffffff"
                  }}
                />

                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"

                  wrapperStyle={{
                    color: "#d6dde5",
                    paddingTop: "16px",
                    fontSize: "12px"
                  }}
                />

              </PieChart>

            </ResponsiveContainer>

          </div>

          {/* ============================================= */}
          {/* LIVE FEED                                     */}
          {/* ============================================= */}

          <div className="feed-panel">

            <div className="feed-header">

              LIVE GOVERNANCE FEED

            </div>

            <div className="feed-item success-feed">

              Governance synchronization operational.

            </div>

            <div className="feed-item warning-feed">

              Escalation aging threshold exceeded.

            </div>

            <div className="feed-item danger-feed">

              Critical district execution bottleneck detected.

            </div>

            <div className="feed-item success-feed">

              Budget coordination successfully stabilized.

            </div>

          </div>

          {/* ============================================= */}
          {/* HEALTH PANEL                                  */}
          {/* ============================================= */}

          <div className="trust-panel">

            <div className="trust-header">

              GOVERNANCE SYSTEM HEALTH

            </div>

            <div className="trust-row">

              Governance Stability
              <span>ACTIVE</span>

            </div>

            <div className="trust-row">

              Execution Integrity
              <span>SYNCED</span>

            </div>

            <div className="trust-row">

              Escalation Visibility
              <span>HEALTHY</span>

            </div>

            <div className="trust-row">

              Budget Coordination
              <span>PROTECTED</span>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================== */}
      {/* FOOTER                                              */}
      {/* =================================================== */}

      <div className="dashboard-footer">

        Governance Monitoring Active • Operational Stability Protected • Institutional Oversight Healthy

      </div>

    </div>

  );
}