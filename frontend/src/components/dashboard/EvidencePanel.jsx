import React from "react";

const EvidencePanel = () => {
  return (
    <div className="panel">

      <h2>Evidence</h2>

      <table>

        <thead>
          <tr>
            <th>Trace</th>
            <th>Type</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>TRACE-1001</td>
            <td>Screenshot</td>
          </tr>

          <tr>
            <td>TRACE-1002</td>
            <td>Log File</td>
          </tr>
        </tbody>

      </table>

    </div>
  );
};

export default EvidencePanel;