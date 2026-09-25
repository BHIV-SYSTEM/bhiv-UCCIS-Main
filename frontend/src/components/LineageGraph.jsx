export default function LineageGraph({ graph }) {

  return (
    <div>

      <h3>LINEAGE GRAPH</h3>

      {graph?.links?.map((link, index) => (

        <div key={index}>

          {link.source}
          {" -> "}
          {link.target}

        </div>

      ))}

    </div>
  );
}