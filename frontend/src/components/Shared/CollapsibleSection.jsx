import { useState } from "react";

export default function CollapsibleSection({
  title,
  children
}) {

  const [open, setOpen] = useState(false);

  return (
    <div className="collapse">

      <div
        className="collapse-header"
        onClick={() => setOpen(!open)}
      >
        {title}
      </div>

      {open && (
        <div className="collapse-content">
          {children}
        </div>
      )}

    </div>
  );
}