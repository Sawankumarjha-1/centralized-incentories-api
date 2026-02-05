import mongoose from "mongoose";

const siteInventorySchema = new mongoose.Schema(
  {
    /* ================= Identity ================= */
    propertyCode: {
      type: String,
      required: true,
      uppercase: true,
      index: true,
    },

    siteImg: { type: String, default: "" },
    images: { type: [String], default: [] },

    /* ================= Location ================= */
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      type: { type: String, required: true }, // Airport / Metro
      area: { type: String, required: true }, // Terminal / Concourse
      packageName: { type: String, required: true },
    },

    /* ================= Screen ================= */
    screen: {
      displayType: { type: String, required: true },
      noOfScreens: { type: Number, required: true },

      resolutionWidth: { type: Number, required: true },
      resolutionHeight: { type: Number, required: true },
      orientation: { type: String, required: true },

      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
      operatingHrsPerDay: { type: Number, required: true },
      daysPerWeek: { type: Number, required: true },
    },

    /* ================= Loop Inputs ================= */
    loop: {
      loopDurationSec: {
        type: Number,
        required: true, // needed for slots & playouts
      },
      spotDurationInSec: {
        type: Number,
        required: true, // core driver of all math
      },
    },

    /* ================= Panel (Physical) ================= */
    panel: {
      widthFeet: { type: Number, required: true },
      heightFeet: { type: Number, required: true },
    },

    /* ================= Visibility & Behaviour ================= */
    visibility: {
      avgDwellTimeSec: {
        type: Number,
        required: true, // REQUIRED for ad opportunity calc
      },

      viewingProbability: {
        type: Number,
        required: true, // REQUIRED for impression multiplier
      },
    },

    /* ================= Audience Inputs ================= */
    audience: {
      avgPassengerPerHr: {
        type: Number,
        required: true, // REQUIRED for avg audience per spot
      },

      monthlyAudience: {
        type: Number, // optional reference / validation
      },
    },

    /* ================= Commercial Inputs ================= */
    commercial: {
      costPerSlotMonth: {
        type: Number,
        required: true, // REQUIRED for CPM
      },

      minBookingPeriod: { type: String },
      minBookingCost: { type: String },
      gstIncluded: { type: String },
    },

    /* ================= Tech Metadata ================= */
    tech: {
      playerSoftware: { type: String },
      ssp: { type: String },
      dspProgrammaticGuaranteed: { type: String },
      dspPreferred: { type: String },
      dspEvergreen: { type: String },
    },
  },
  { timestamps: true },
);

export default mongoose.model("SiteInventory", siteInventorySchema);
