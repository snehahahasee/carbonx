const BENCHMARK_EMISSIONS = 1000;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function calculateEmission({ electricity, fuel }) {
  return Number((electricity * 0.82 + fuel * 2.31).toFixed(2));
}

function calculateScore(totalEmissions) {
  const score = 100 - (totalEmissions / BENCHMARK_EMISSIONS) * 100;
  return Number(clamp(score, 0, 100).toFixed(1));
}

function createRecommendations({ electricity, fuel, transport }) {
  const recommendations = [];

  if (electricity > 300) {
    recommendations.push({
      title: "Adopt rooftop solar during peak load hours",
      description: "Shift high-consumption operations to solar-supported daytime slots.",
      co2Reduction: 148,
      savings: 12600
    });
  }

  if (fuel > 100) {
    recommendations.push({
      title: "Optimize fuel routes and idle time",
      description: "Use route batching and maintenance checks to reduce monthly fuel burn.",
      co2Reduction: 96,
      savings: 8800
    });
  }

  if (transport > 500) {
    recommendations.push({
      title: "Consolidate transport dispatches",
      description: "Combine low-volume trips and prioritize nearby vendors.",
      co2Reduction: 72,
      savings: 6200
    });
  }

  const defaults = [
    {
      title: "Replace legacy lighting with LEDs",
      description: "Cut cooling load and electricity leakage in daily operations.",
      co2Reduction: 54,
      savings: 4100
    },
    {
      title: "Schedule energy audits for heavy equipment",
      description: "Find hidden motor, refrigeration, and standby losses.",
      co2Reduction: 63,
      savings: 5300
    },
    {
      title: "Move suppliers to low-carbon invoices",
      description: "Track vendor emissions and prefer lower-footprint procurement.",
      co2Reduction: 41,
      savings: 2900
    }
  ];

  return [...recommendations, ...defaults].slice(0, 3);
}

function createCertificateHash() {
  const bytes = Array.from({ length: 18 }, () => Math.floor(Math.random() * 256));
  return `0x${bytes.map((byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}

function insightFor(totalEmissions) {
  if (totalEmissions > 500) {
    return {
      level: "high",
      message: `You could save Rs ${Math.round(totalEmissions * 18)} by optimizing energy and fuel use.`
    };
  }

  return {
    level: "good",
    message: "Your footprint is controlled. Small efficiency upgrades can still unlock savings."
  };
}

function summarizeEmission(input) {
  const total_emissions = calculateEmission(input);
  const carbon_score = calculateScore(total_emissions);
  const recommendations = createRecommendations(input);
  const reduced_emissions = recommendations.reduce((sum, item) => sum + item.co2Reduction, 0);
  const credits = Number((reduced_emissions / 10).toFixed(1));

  return {
    total_emissions,
    carbon_score,
    recommendations,
    reduced_emissions,
    credits,
    rupeeEquivalent: Math.round(credits * 720),
    costInsight: insightFor(total_emissions)
  };
}

module.exports = {
  BENCHMARK_EMISSIONS,
  calculateEmission,
  calculateScore,
  createCertificateHash,
  createRecommendations,
  summarizeEmission
};
