export default function siteInventoryCalculator(inv) {
  const { loop, visibility, audience, screen, commercial } = inv;

  const { loopDurationSec, spotDurationInSec } = loop || {};
  const { avgDwellTimeSec, viewingProbability } = visibility || {};
  const { avgPassengerPerHr } = audience || {};
  const { operatingHrsPerDay, daysPerWeek } = screen || {};
  const { costPerSlotMonth } = commercial || {};
  const noOfScreens = screen?.noOfScreens || 1;
  console.log("noOfScreens", noOfScreens);

  // ---- SAFETY GUARDS ----
  if (
    !loopDurationSec ||
    !spotDurationInSec ||
    avgPassengerPerHr == null ||
    !avgDwellTimeSec ||
    viewingProbability == null ||
    !operatingHrsPerDay ||
    !daysPerWeek ||
    !costPerSlotMonth
  ) {
    return null;
  }

  // ---- NORMALIZATION ----
  // Viewing probability stored as percentage (e.g. 90)
  const viewingProbDecimal = viewingProbability / 100;
  console.log("viewingProbDecimal", viewingProbDecimal);

  // ---- CORE FORMULAS (EXCEL MATCHED) ----

  // Total Slots = Loop Duration / Spot Duration
  const totalSlots = loopDurationSec / spotDurationInSec;
  // console.log("totalSlots", totalSlots);

  // Playouts per Hour = 3600 / Loop Duration
  const playoutsPerHour = 3600 / loopDurationSec;
  // console.log("playoutsPerHour", playoutsPerHour);

  // Avg Audience per Spot = Avg Passengers per Hour × (Spot Duration / 3600)
  const avgAudiencePerSpot = avgPassengerPerHr * (spotDurationInSec / 3600);
  // console.log("avgAudiencePerSpot", avgAudiencePerSpot);

  // Ad Opportunities per Passenger = Avg Dwell Time / Spot Duration

  const adOpportunitiesPerPassenger = avgDwellTimeSec / loopDurationSec;
  // console.log("adOpportunitiesPerPassenger", adOpportunitiesPerPassenger);

  // Impression Multiplier
  const impressionMultiplier =
    avgAudiencePerSpot * adOpportunitiesPerPassenger * viewingProbDecimal;

  console.log("impressionMultiplier", impressionMultiplier);

  // console.log(noOfScreens, operatingHrsPerDay, playoutsPerHour);
  const adPlayoutsPerDay = playoutsPerHour * noOfScreens * operatingHrsPerDay;
  // console.log("adPlayoutsPerDay", adPlayoutsPerDay);
  const impressionsPerDay =
    playoutsPerHour *
    noOfScreens *
    operatingHrsPerDay *
    Number(impressionMultiplier.toFixed(2));

  // Impressions per Month
  const impressionsPerMonth = impressionsPerDay * 30.4;

  // console.log("impressionsPerMonth", impressionsPerMonth);

  const costPerDay = costPerSlotMonth / 30.4;

  // CMP / CPM Rate (INR)
  const cmpRateInr =
    impressionsPerMonth > 0
      ? (Number(costPerDay.toFixed(2)) / Number(impressionsPerDay.toFixed(2))) *
        1000
      : 0;
  // console.log("cmpRateInr", cmpRateInr);

  return {
    totalSlots: Number(totalSlots.toFixed(2)),
    playoutsPerHour: Number(playoutsPerHour.toFixed(2)),
    avgAudiencePerSpot: Number(avgAudiencePerSpot.toFixed(2)),
    adOpportunitiesPerPassenger: Number(adOpportunitiesPerPassenger.toFixed(2)),
    impressionMultiplier: Number(impressionMultiplier.toFixed(2)),
    adPlayoutsPerDay: Number(adPlayoutsPerDay.toFixed(0)),
    impressionsPerDay: Number(impressionsPerDay.toFixed(0)),
    impressionsPerMonth: Number(impressionsPerMonth.toFixed(0)),
    CPM_INR: Number(cmpRateInr.toFixed(2)), // ✅ 2,204.59
    costPerDay: Number(costPerDay.toFixed(2)),
  };
}
