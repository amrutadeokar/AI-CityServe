import { useState } from "react";

function InfoCard({ title, content }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="info-card">
      <div className="info-header" onClick={() => setOpen(!open)}>
        <h4>{title}</h4>
        <span>{open ? "▲" : "▼"}</span>
      </div>
      {open && <div className="info-content">{content}</div>}
    </div>
  );
}

export default InfoCard;
