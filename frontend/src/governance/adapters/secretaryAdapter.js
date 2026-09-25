// src/governance/adapters/secretaryAdapter.js

export function secretaryAdapter() {

  return {

    escalationChains: [
      {
        district: "Mumbai",
        escalationLevel: "State Priority",
        issue:
          "Flood mitigation response delayed",
        owner:
          "Regional Emergency Office"
      },

      {
        district: "Nashik",
        escalationLevel: "High Priority",
        issue:
          "Reservoir overflow coordination pending",
        owner:
          "Water Resource Division"
      }
    ],

    agingIncidents: [
      {
        district: "Thane",
        age: "4 hrs",
        severity: "Critical"
      },

      {
        district: "Pune",
        age: "2 hrs",
        severity: "High"
      }
    ],

    delayedExecutions: [
      {
        department:
          "Drainage Operations",
        delay:
          "47 mins",
        reason:
          "Vehicle congestion"
      }
    ],

    operationalHealth: [
      {
        district: "Mumbai",
        health: 72
      },

      {
        district: "Nashik",
        health: 64
      },

      {
        district: "Pune",
        health: 81
      }
    ]
  };
}