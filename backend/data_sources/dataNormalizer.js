exports.normalizeData = (trafficData, civicData) => {
  return trafficData.map(zone => {
    const civic = civicData.find(c => c.zone_id === zone.zone_id);

    const water_supply = civic ? civic.water_supply : 50;
    const complaints = civic ? civic.complaints : 0;

    const waste_level = Math.min(
      100,
      Math.max(0, (100 - water_supply) + complaints * 2)
    );

    return {
      zone_id: zone.zone_id,
      zone_name: "Zone " + zone.zone_id,

      traffic: zone.traffic,
      violations: zone.violations,

      water_supply,
      complaints,
      waste_level,

      history: zone.history || []
    };
  });
};