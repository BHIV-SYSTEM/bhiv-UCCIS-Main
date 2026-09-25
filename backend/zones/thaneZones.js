const thaneZones = [

  {
    zone: 'Thane West',

    traffic_state: 'MEDIUM',

    flooding_risk: 'LOW',

    complaints: 20,

    water_issues: 8,

    waste_overload: false,

    escalation_state: 'NORMAL',

    confidence_score: 87,

    temporal_behavior: 'Stable'
  },

  {
    zone: 'Kalyan',

    traffic_state: 'HIGH',

    flooding_risk: 'MEDIUM',

    complaints: 50,

    water_issues: 15,

    waste_overload: true,

    escalation_state: 'ACTIVE',

    confidence_score: 91,

    temporal_behavior: 'Rising'
  }

];

module.exports = thaneZones;