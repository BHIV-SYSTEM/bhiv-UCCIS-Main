function DatasetCard({ title, count, onClick }) {
  return (
    <div className="dataset-card" onClick={onClick}>
      <h3>{title}</h3>
      <h2>{count}</h2>
    </div>
  );
}

export default DatasetCard;