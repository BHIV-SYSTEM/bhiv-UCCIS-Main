function DatasetTable({ title, rows }) {
  if (!rows.length) {
    return (
      <div className="table-container">
        <h2>{title}</h2>
        <p>No Data Available</p>
      </div>
    );
  }

  const headers = Object.keys(rows[0]);

  return (
    <div className="table-container">
      <h2>{title}</h2>

      <table>
        <thead>
          <tr>
            {headers.map((head) => (
              <th key={head}>{head}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {headers.map((head) => (
                <td key={head}>
                  {String(row[head])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DatasetTable;