// engine/conflictEngine.js

class ConflictEngine {

  resolve(domains) {

    // =====================================
    // SAFE DEFAULTS
    // =====================================

    const traffic =
      domains.traffic || {
        score: 0,
        level: "LOW"
      };

    const flooding =
      domains.flooding || {
        score: 0,
        level: "LOW"
      };

    const water =
      domains.water_shortage || {
        score: 0,
        level: "LOW"
      };

    const waste =
      domains.waste_overload || {
        score: 0,
        level: "LOW"
      };

    const complaints =
      domains.complaints || {
        score: 0,
        level: "LOW"
      };

    // =====================================
    // ALL DOMAINS
    // =====================================

    const allDomains = {

      traffic,

      flooding,

      water_shortage:
        water,

      waste_overload:
        waste,

      complaints
    };

    // =====================================
    // FIND DOMINANT DOMAIN
    // =====================================

    let dominantDomain =
      "traffic";

    let maxScore = 0;

    Object.keys(allDomains)
      .forEach(domain => {

        if (
          allDomains[domain].score >
          maxScore
        ) {

          maxScore =
            allDomains[domain].score;

          dominantDomain =
            domain;
        }
      });

    // =====================================
    // OVERRIDE REASON
    // =====================================

    let reason =
      `${dominantDomain} override activated`;

    // =====================================
    // INFLUENCE MODEL
    // =====================================

    const influencedDomains = {

      traffic: {
        score:
          traffic.score,

        level:
          traffic.level
      },

      flooding: {
        score:
          flooding.score,

        level:
          flooding.level
      },

      water_shortage: {
        score:
          water.score,

        level:
          water.level
      },

      waste_overload: {
        score:
          waste.score,

        level:
          waste.level
      },

      complaints: {
        score:
          complaints.score,

        level:
          complaints.level
      }
    };

    // =====================================
    // FLOODING INFLUENCE
    // =====================================

    if (
      flooding.level === "HIGH"
    ) {

      influencedDomains.traffic.score += 20;

      influencedDomains.traffic
        .influenced_by =
          "flooding";
    }

    // =====================================
    // WATER SHORTAGE INFLUENCE
    // =====================================

    if (
      water.level === "HIGH"
    ) {

      influencedDomains.complaints.score += 15;

      influencedDomains.complaints
        .influenced_by =
          "water_shortage";
    }

    // =====================================
    // FINAL OUTPUT
    // =====================================

    return {

      dominant_domain:
        dominantDomain,

      final_score:
        maxScore,

      reason,

      influenced_domains:
        influencedDomains
    };
  }
}

module.exports =
  new ConflictEngine();