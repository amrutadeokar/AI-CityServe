import { useState } from "react";
import "./Services.css";

function Services() {
  const services = [
    { name: "Sanitation", icon: "🧹", color: "#FCE4EC" },
    { name: "Water Supply", icon: "💧", color: "#E0F2F1" },
    { name: "Roads", icon: "🛣️", color: "#FFF3E0" },
    { name: "Electricity", icon: "⚡", color: "#F9FBE7" },
    { name: "Health", icon: "🏥", color: "#E8EAF6" },
    { name: "Education", icon: "🎓", color: "#FFFDE7" },
  ];

  return (
    <section className="services-section">
      <h2 className="services-title">Our Services</h2>
      <div className="services-grid-inner">
        {services.map((s) => (
          <div key={s.name} className="service-card" style={{ backgroundColor: s.color }}>
            <span className="service-icon-large">{s.icon}</span>
            <p className="service-label">{s.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Services;
