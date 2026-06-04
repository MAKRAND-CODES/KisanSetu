export const checkSchemeEligibility = (scheme, farmer) => {
  const reasons = [];
  let eligible = true;

  if (scheme.eligibility?.minLandArea > farmer.landArea) {
    eligible = false;
    reasons.push(`Minimum land area required is ${scheme.eligibility.minLandArea}`);
  }

  if (
    scheme.eligibility?.states?.length > 0 &&
    !scheme.eligibility.states.includes(farmer.state)
  ) {
    eligible = false;
    reasons.push(`Scheme is not available in ${farmer.state}`);
  }

  if (eligible) {
    reasons.push("Farmer is eligible for this scheme");
  }

  return { eligible, reasons };
};