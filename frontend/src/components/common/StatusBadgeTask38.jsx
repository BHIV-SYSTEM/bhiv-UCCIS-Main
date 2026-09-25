export default function StatusBadgeTask38({ status }) {
  const color =
    status === "Closed"
      ? "red"
      : status === "Open"
      ? "green"
      : "orange";

  return <span style={{ color }}>{status}</span>;
}