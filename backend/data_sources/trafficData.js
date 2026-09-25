exports.getTrafficData = () => {
  return [
    { zone_id: 1, traffic: 75, violations: 6, history: [60, 65, 70] },
    { zone_id: 2, traffic: 40, violations: 2, history: [30, 35, 38] },
    { zone_id: 3, traffic: 90, violations: 8, history: [80, 85, 88] },
    { zone_id: 4, traffic: 55, violations: 4, history: [50, 52, 54] },
    { zone_id: 5, traffic: 30, violations: 1, history: [25, 28, 29] },
    { zone_id: 6, traffic: 85, violations: 7, history: [78, 80, 83] },
    { zone_id: 7, traffic: 65, violations: 5, history: [60, 62, 64] },
    { zone_id: 8, traffic: 20, violations: 1, history: [15, 18, 19] }
  ];
};