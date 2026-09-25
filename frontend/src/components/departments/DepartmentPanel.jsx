export default function DepartmentPanel() {
  return (
    <div className="col-span-12 bg-[#0b1220] border border-[#1f2a44] rounded-xl p-3 mt-2">

      <h3 className="text-sm font-semibold mb-3">
        Department Performance
      </h3>

      <div className="grid grid-cols-6 gap-2 text-xs">

        <div>Health - 82%</div>
        <div>Transport - 74%</div>
        <div>Energy - 91%</div>
        <div>Water - 69%</div>
        <div>Education - 88%</div>
        <div>Revenue - 76%</div>

      </div>

    </div>
  );
}