const { DOMAIN_PRIORITY } = require("../utils/constants");

function resolveOverride(domains) {

  let dominant = null;

  Object.keys(domains).forEach(domain => {

    if (!dominant) {
      dominant = domain;
      return;
    }

    const currentPriority =
      DOMAIN_PRIORITY[domain];

    const dominantPriority =
      DOMAIN_PRIORITY[dominant];

    if (currentPriority > dominantPriority) {
      dominant = domain;
    }
  });

  return dominant;
}

module.exports = {
  resolveOverride
};