export default function StatusFilter({
  onChange
}) {
  return (
    <select
      onChange={(e) =>
        onChange(e.target.value)
      }
    >
      <option value="">
        All
      </option>

      <option value="Open">
        Open
      </option>

      <option value="Closed">
        Closed
      </option>

      <option value="Pending">
        Pending
      </option>
    </select>
  );
}