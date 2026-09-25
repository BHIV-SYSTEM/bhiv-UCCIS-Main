import ZoneCard from "./ZoneCard";

export default function ZoneGrid({ data }) {
  return (
    <div className="grid">
      <ZoneCard data={data} />
    </div>
  );
}