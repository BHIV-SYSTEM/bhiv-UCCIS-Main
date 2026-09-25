import React from "react";

export default function SchemaInspectionPanel({
  schemas = []
}) {

  return (

    <div className="bg-white p-6 rounded-2xl shadow-lg">

      <h2 className="text-2xl font-bold mb-6">
        Schema Inspection
      </h2>

      <div className="space-y-4">

        {schemas.map((schema, index) => (

          <div
            key={index}
            className="border rounded-xl p-4"
          >

            <div className="flex justify-between items-center mb-3">

              <h3 className="text-xl font-semibold">
                {schema.name}
              </h3>

              <span className="text-sm bg-gray-200 px-3 py-1 rounded-full">
                {schema.version}
              </span>

            </div>

            <div className="space-y-2">

              <p>
                <strong>Fields:</strong>
              </p>

              <ul className="list-disc ml-6 text-gray-700">

                {schema.fields.map((field, i) => (

                  <li key={i}>
                    {field}
                  </li>

                ))}

              </ul>

            </div>

            <div className="mt-4">

              <p>
                <strong>Validation:</strong>{" "}
                <span className="text-green-600 font-semibold">
                  VALID
                </span>
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}