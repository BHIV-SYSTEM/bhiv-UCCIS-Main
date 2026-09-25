const { mysqlDB } = require("../config/db");

async function seed() {

  try {

    console.log("Starting Seed...");

    await db.query(`
      INSERT INTO departments
      (department_name)
      VALUES
      ('Disaster Management'),
      ('Fire Department'),
      ('Police Control'),
      ('Medical Emergency')
    `);

    await db.query(`
      INSERT INTO locations
      (district,state)
      VALUES
      ('Nashik','Maharashtra'),
      ('Pune','Maharashtra'),
      ('Mumbai','Maharashtra')
    `);

    await db.query(`
      INSERT INTO operators
      (name,department_id)
      VALUES
      ('Madhumati',1),
      ('Ankita',1),
      ('Nupur',2),
      ('Soham',3)
    `);

    await db.query(`
      INSERT INTO signals
      (signal_type,location_id)
      VALUES
      ('FIRE_ALERT',1),
      ('FLOOD_ALERT',2),
      ('CYBER_ATTACK',3)
    `);

    await db.query(`
      INSERT INTO telemetry_events
      (signal_id,event_status)
      VALUES
      (1,'RECEIVED'),
      (2,'ACTIVE'),
      (3,'CRITICAL')
    `);

    await db.query(`
      INSERT INTO incidents
      (event_id,severity)
      VALUES
      (1,'HIGH'),
      (2,'HIGH'),
      (3,'CRITICAL')
    `);

    await db.query(`
      INSERT INTO escalations
      (incident_id,escalated_to)
      VALUES
      (1,'DISTRICT_CONTROL'),
      (2,'STATE_CONTROL'),
      (3,'NATIONAL_CONTROL')
    `);

    await db.query(`
      INSERT INTO decisions
      (escalation_id,decision_text)
      VALUES
      (1,'Deploy Fire Team'),
      (2,'Evacuate Area'),
      (3,'Activate Cyber Defense')
    `);

    await db.query(`
      INSERT INTO approvals
      (decision_id,approved_by)
      VALUES
      (1,'Supervisor A'),
      (2,'Supervisor B'),
      (3,'Supervisor C')
    `);

    await db.query(`
      INSERT INTO replay_sessions
      (incident_id,replay_result)
      VALUES
      (1,'Replay Generated'),
      (2,'Replay Generated'),
      (3,'Replay Generated')
    `);

    await db.query(`
      INSERT INTO runtime_logs
      (replay_id,log_message)
      VALUES
      (1,'Replay Complete'),
      (2,'Replay Complete'),
      (3,'Replay Complete')
    `);

    console.log("Seed Completed");

  } catch (error) {

    console.log(error);

  }

}

seed();