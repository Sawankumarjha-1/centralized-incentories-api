import express from "express";
import Property from "../models/property.model.js";

const router = express.Router();

/* ---------------- CREATE PROPERTY ---------------- */
router.post("/create", async (req, res) => {
  try {
    const property = await Property.create(req.body);
    res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: property,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Property code must be unique",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* ---------------- GET ALL PROPERTIES ---------------- */
router.get("/", async (req, res) => {
  try {
    const properties = await Property.find()
      .sort({ name: 1 }) // 1 for ascending, -1 for descending
      .select("-siteInventories -createdAt -updatedAt -__v");

    res.json({ success: true, data: properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ---------------- GET PROPERTY BY CODE ---------------- */
router.get("/:property_code", async (req, res) => {
  try {
    const property = await Property.findOne({
      property_code: req.params.property_code.toUpperCase(),
    });

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    res.json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
