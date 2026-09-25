const mmrZones = [

  {
    zone: 'Navi Mumbai',

    traffic_state: 'LOW',

    flooding_risk: 'LOW',

    complaints: 10,

    water_issues: 3,

    waste_overload: false,

    escalation_state: 'NORMAL',

    confidence_score: 85,

    temporal_behavior: 'Stable'
  },

  {
    zone: 'Panvel',

    traffic_state: 'HIGH',

    flooding_risk: 'HIGH',

    complaints: 60,

    water_issues: 25,

    waste_overload: true,

    escalation_state: 'CRITICAL',

    confidence_score: 95,

    temporal_behavior: 'Escalating'
  }

];

module.exports = mmrZones;