export default function RuntimeLogs({ data = [] }) {
  const logs =
    data.length > 0
      ? data
      : [
          {
            level: "INFO",
            module: "backend",
            message: "System initialized",
          },
          {
            level: "INFO",
            module: "telemetry",
            message: "Stream started",
          },
        ];

  // return (
  //   <div
  //     style={{
  //       background: "#141b2d",
  //       borderRadius: "12px",
  //       padding: "20px",
  //       marginTop: "20px",
  //     }}
  //   >
  //     <h3
  //       style={{
  //         color: "#ffffff",
  //         fontSize: "20px",
  //         fontWeight: "700",
  //         marginBottom: "20px",
  //       }}
  //     >
  //       🧾 Live Runtime Logs
  //     </h3>

  //     {logs.map((log, index) => (
  //       <div
  //         key={index}
  //         style={{
  //           display: "flex",
  //           alignItems: "center",
  //           marginBottom: "18px",
  //           fontSize: "20px",
  //           lineHeight: "1.5",
  //         }}
  //       >
  //         <span
  //           style={{
  //             color: "#3b82f6",
  //             fontWeight: "700",
  //             minWidth: "70px",
  //           }}
  //         >
  //           [{(log.level || "INFO").toUpperCase()}]
  //         </span>

  //         <span
  //           style={{
  //             color: "#ffffff",
  //             fontWeight: "700",
  //             marginLeft: "8px",
  //           }}
  //         >
  //           {log.module}
  //         </span>

  //         <span
  //           style={{
  //             color: "#9ca3af",
  //             marginLeft: "8px",
  //           }}
  //         >
  //           → {log.message}
  //         </span>
  //       </div>
  //     ))}
  //   </div>
  // );
}