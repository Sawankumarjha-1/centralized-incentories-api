// models/property.model.js
import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    property_code: {
      type: String,
      required: true,
      uppercase: true,
      unique: true,
      index: true,
    },
    city: { type: String, required: true },
    country: { type: String, default: "India" },
    latitude: Number,
    longitude: Number,
    total_packages: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    // ✅ link inventories
    siteInventories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SiteInventory",
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Property", propertySchema);
