const mongoose =
require("mongoose");

async function migrate() {

  console.log(
    "Running Runtime Migration..."
  );

  const collections = [

    "signals",
    "telemetries",
    "incidents",
    "escalations",
    "replays",
    "evidences"

  ];

  const existing =
    await mongoose.connection
      .db
      .listCollections()
      .toArray();

  const names =
    existing.map(
      item => item.name
    );

  for (
    const collection
    of collections
  ) {

    if (
      !names.includes(
        collection
      )
    ) {

      await mongoose.connection
        .db
        .createCollection(
          collection
        );

      console.log(
        `${collection} created`
      );

    }

  }

  console.log(
    "Migration Complete"
  );

}

module.exports = migrate;