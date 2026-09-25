export const statusColor = (
  status
) => {

  switch (status) {

    case "Open":
      return "#ef4444";

    case "Closed":
      return "#22c55e";

    case "Pending":
      return "#f59e0b";

    default:
      return "#64748b";
  }
};