class SchemaValidator {

  validate(body) {

    if (!body.zone_id) {

      return {

        valid: false,

        type:
          "SCHEMA_MISMATCH",

        reason:
          "zone_id missing",

        recovery:
          "Provide valid zone_id"
      };
    }

    if (!body.domains) {

      return {

        valid: false,

        type:
          "SCHEMA_MISMATCH",

        reason:
          "domains missing",

        recovery:
          "Provide domains object"
      };
    }

    return {

      valid: true
    };
  }
}

module.exports =
  new SchemaValidator();