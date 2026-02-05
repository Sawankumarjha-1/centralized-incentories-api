import express from "express";
import Property from "../models/property.model.js";
import SiteInventory from "../models/siteInventory.model.js";
import calculateInventoryMetrics from "../utils/siteInventoryCalculator.js";

const router = express.Router();

/* -------- ADD SITE INVENTORY -------- */
router.post("/add/:propertyCode", async (req, res) => {
  try {
    const code = req.params.propertyCode.toUpperCase();

    const property = await Property.findOne({
      property_code: code,
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    const inventory = await SiteInventory.create({
      ...req.body,
      propertyCode: code,
    });

    property.siteInventories.push(inventory._id);
    property.total_packages = property.siteInventories.length;
    await property.save();

    res.status(201).json({
      success: true,
      message: "Site inventory added successfully",
      data: inventory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* -------- GET ALL INVENTORIES OF A PROPERTY -------- */
router.get("/:propertyCode", async (req, res) => {
  try {
    const property = await Property.findOne({
      property_code: req.params.propertyCode.toUpperCase(),
    }).populate("siteInventories");

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    const inventoriesWithMetrics = property.siteInventories.map((inv) => {
      const metrics = calculateInventoryMetrics(inv);
      const invObj = inv.toObject();

      // ❌ Remove costPerSlotMonth from response
      if (invObj.commercial) {
        delete invObj.commercial.costPerSlotMonth;
      }

      return {
        ...invObj, // ✅ USE THIS
        metrics,
      };
    });

    res.json({
      success: true,
      count: inventoriesWithMetrics.length,
      data: inventoriesWithMetrics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
