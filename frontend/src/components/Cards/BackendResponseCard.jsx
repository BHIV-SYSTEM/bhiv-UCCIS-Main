export default function BackendResponseCard({ title, data }) {

  return (
    <div className="backend-card">

      <div className="card-header">
        {title}
      </div>

      <pre className="backend-response">
        {JSON.stringify(data, null, 2)}
      </pre>

    </div>
  );
}