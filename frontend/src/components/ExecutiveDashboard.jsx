import { Link } from "react-router-dom";

function ExecutiveDashboard() {

  const phases = [

    {
      title:
        "PHASE 1 — Canonical Repository",
      route: "/phase1"
    },

    {
      title:
        "PHASE 2 — Replay Lineage",
      route: "/phase2"
    },

    {
      title:
        "PHASE 3 — Operational Entropy",
      route: "/phase3"
    },

    {
      title:
        "PHASE 4 — Executive UX",
      route: "/phase4"
    },

    {
      title:
        "PHASE 5 — Runtime Proof",
      route: "/phase5"
    },

    {
      title:
        "PHASE 6 — Validation",
      route: "/phase6"
    },

    {
      title:
        "PHASE 7 — Operational Flow",
      route: "/phase7"
    }

  ];

  return (

    <div
      style={{
        background: "#071018",
        minHeight: "100vh",
        color: "white",
        padding: "30px"
      }}
    >

      <h1>
        UCCIS Executive Dashboard
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3, 1fr)",
          gap: "20px",
          marginTop: "30px"
        }}
      >

        {phases.map((phase) => (

          <Link
            key={phase.route}
            to={phase.route}
            style={{
              textDecoration: "none"
            }}
          >

            <div
              style={{
                background: "#102030",
                padding: "30px",
                borderRadius: "14px",
                border:
                  "1px solid #1f3b57",
                color: "white",
                cursor: "pointer"
              }}
            >

              <h2>
                {phase.title}
              </h2>

            </div>

          </Link>

        ))}

      </div>

    </div>

  );

}

export default ExecutiveDashboard;