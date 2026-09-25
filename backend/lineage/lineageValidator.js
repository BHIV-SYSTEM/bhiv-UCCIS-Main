import { buildOrderedLineage } from "./orderingEngine.js";

export const validateLineage = () => {

  const result = buildOrderedLineage();

  return {
    status: "LINEAGE VERIFIED",
    before: result.before,
    after: result.after
  };
};