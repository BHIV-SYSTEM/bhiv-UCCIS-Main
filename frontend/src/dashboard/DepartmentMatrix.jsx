function DepartmentMatrix() {
  return (
    <div className="matrix">
      <h2>Department Performance Matrix</h2>

      <table>
        <thead>
          <tr>
            <th>Department</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Police</td>
            <td>ACTIVE</td>
          </tr>

          <tr>
            <td>Fire</td>
            <td>STABLE</td>
          </tr>

          <tr>
            <td>Medical</td>
            <td>HIGH LOAD</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default DepartmentMatrix;