export const phaseData = {
  "Phase 1": {
    title: "Database Engineering",

    cards: {
      Tables: 14,
      ForeignKeys: 21,
      Indexes: 37,
      Migrations: 11,
    },

    barData: [
      { name: "Tables", value: 14 },
      { name: "FK", value: 21 },
      { name: "Indexes", value: 37 },
      { name: "Migrations", value: 11 },
    ],

    pieData: [
      { name: "Completed", value: 86 },
      { name: "Pending", value: 14 },
    ],

    backend: {
      schema: "Loaded",
      migrations: "Success",
      seeders: "Success",
    },
  },

  "Phase 2": {
    title: "Relationship Validation",

    cards: {
      Joins: 26,
      Records: 384,
      Checks: 57,
      Relations: 19,
    },

    barData: [
      { name: "Joins", value: 26 },
      { name: "Records", value: 384 },
      { name: "Checks", value: 57 },
      { name: "Relations", value: 19 },
    ],

    pieData: [
      { name: "Valid", value: 91 },
      { name: "Failed", value: 9 },
    ],

    backend: {
      status: "Validated",
    },
  },

  "Phase 3": {
    title: "Runtime Engine",

    cards: {
      Signals: 28,
      Telemetry: 43,
      Incidents: 17,
      Logs: 36,
    },

    barData: [
      { name: "Signals", value: 28 },
      { name: "Telemetry", value: 43 },
      { name: "Incidents", value: 17 },
      { name: "Logs", value: 36 },
    ],

    pieData: [
      { name: "Processed", value: 78 },
      { name: "Pending", value: 22 },
    ],

    backend: {
      runtime: "Active",
    },
  },

  "Phase 4": {
    title: "TTG Dataset",

    cards: {
      Flood: 12,
      Traffic: 27,
      Medical: 19,
      Cyber: 8,
    },

    barData: [
      { name: "Flood", value: 12 },
      { name: "Traffic", value: 27 },
      { name: "Medical", value: 19 },
      { name: "Cyber", value: 8 },
    ],

    pieData: [
      { name: "Available", value: 82 },
      { name: "Processing", value: 18 },
    ],

    backend: {
      dataset: "Loaded",
    },
  },

  "Phase 5": {
    title: "Master DB Validation",

    cards: {
      Entities: 18,
      Reviews: 13,
      Corrections: 9,
      Approved: 15,
    },

    barData: [
      { name: "Entities", value: 18 },
      { name: "Reviews", value: 13 },
      { name: "Corrections", value: 9 },
      { name: "Approved", value: 15 },
    ],

    pieData: [
      { name: "Approved", value: 84 },
      { name: "Pending", value: 16 },
    ],

    backend: {
      validation: "Passed",
    },
  },

  "Phase 6": {
    title: "Demo Chain",

    cards: {
      Signals: 16,
      Replays: 24,
      Decisions: 18,
      Logs: 31,
    },

    barData: [
      { name: "Signals", value: 16 },
      { name: "Replays", value: 24 },
      { name: "Decisions", value: 18 },
      { name: "Logs", value: 31 },
    ],

    pieData: [
      { name: "Verified", value: 88 },
      { name: "Pending", value: 12 },
    ],

    backend: {
      chain: "Verified",
    },
  },

  "Phase 7": {
    title: "Runtime Proof",

    cards: {
      Requests: 72,
      Responses: 64,
      Logs: 118,
      Evidence: 89,
    },

    barData: [
      { name: "Requests", value: 72 },
      { name: "Responses", value: 64 },
      { name: "Logs", value: 118 },
      { name: "Evidence", value: 89 },
    ],

    pieData: [
      { name: "Complete", value: 87 },
      { name: "Missing", value: 13 },
    ],

    backend: {
      proof: "Available",
    },
  },
};