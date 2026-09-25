const zonesTask2 = [
  {
    id: "zone_1",
    name: "Zone 1",
    traffic_density: 40,
    violation_count: 3,
    congestion_level: "LOW",
    trend: "stable"
  },
  {
    id: "zone_2",
    name: "Zone 2",
    traffic_density: 55,
    violation_count: 6,
    congestion_level: "MEDIUM",
    trend: "stable"
  },
  {
    id: "zone_3",
    name: "Zone 3",
    traffic_density: 68,
    violation_count: 9,
    congestion_level: "MEDIUM",
    trend: "increasing"
  },
  {
    id: "zone_4",
    name: "Zone 4",
    traffic_density: 82,
    violation_count: 15,
    congestion_level: "HIGH",
    trend: "increasing"
  },
  {
    id: "zone_5",
    name: "Zone 5",
    traffic_density: 75,
    violation_count: 12,
    congestion_level: "HIGH",
    trend: "increasing"
  },
  {
    id: "zone_6",
    name: "Zone 6",
    traffic_density: 30,
    violation_count: 1,
    congestion_level: "LOW",
    trend: "stable"
  }
];

// 🔥 Add status + alerts
zonesTask2.forEach(zone => {

  if (zone.traffic_density > 70 || zone.violation_count > 10) {
    zone.status = "RED";
  } else if (zone.traffic_density > 50) {
    zone.status = "YELLOW";
  } else {
    zone.status = "GREEN";
  }

  zone.alerts = [];

  if (zone.traffic_density > 70) {
    zone.alerts.push("HIGH_TRAFFIC");
  }

  if (zone.violation_count > 10) {
    zone.alerts.push("HIGH_VIOLATIONS");
  }

  if (zone.congestion_level === "HIGH") {
    zone.alerts.push("HIGH_CONGESTION");
  }
});

module.exports = zonesTask2;