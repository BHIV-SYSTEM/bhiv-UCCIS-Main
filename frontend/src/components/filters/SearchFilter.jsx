export default function SearchFilter({
  value,
  onChange
}) {
  return (
    <input
      className="search-filter"
      placeholder="Search..."
      value={value}
      onChange={(e) =>
        onChange(e.target.value)
      }
    />
  );
}