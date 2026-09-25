import React from "react";

function RuntimeLogsTasks29({ logs = [] }) {

  const runtimeLogs = Array.isArray(logs) ? logs : [];

  return (
    <div className="card">

      <h2>Runtime Logs</h2>

      <table width="100%">

        <thead>
          <tr>
            <th>ID</th>
            <th>Message</th>
          </tr>
        </thead>

        <tbody>

          {runtimeLogs.length > 0 ? (

            runtimeLogs.map((log, index) => (
              <tr key={log?.id ?? index}>

                <td>
                  {log?.id ?? "-"}
                </td>

                <td>
                  {log?.log_message ?? "-"}
                </td>

              </tr>
            ))

          ) : (

            <tr>
              <td
                colSpan="2"
                style={{ textAlign: "center" }}
              >
                No runtime logs found
              </td>
            </tr>

          )}

        </tbody>

      </table>

    </div>
  );
}

export default RuntimeLogsTasks29;