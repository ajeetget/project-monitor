import Vertical from "../models/Vertical.js";

export const createVertical = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Vertical name is required",
      });
    }

    const existingVertical = await Vertical.findOne({
      name: name.trim(),
    });

    if (existingVertical) {
      return res.status(409).json({
        message: "Vertical already exists",
      });
    }

    const vertical = await Vertical.create({
      name: name.trim(),
    });

    res.status(201).json({
      message: "Vertical created successfully",
      vertical,
    });
  } catch (error) {
    console.error("Create vertical error:", error);

    res.status(500).json({
      message: "Failed to create vertical",
      error: error.message,
    });
  }
};

export const getVerticals = async (req, res) => {
  try {
    const verticals = await Vertical.find().sort({ name: 1 });

    res.status(200).json(verticals);
  } catch (error) {
    console.error("Get verticals error:", error);

    res.status(500).json({
      message: "Failed to fetch verticals",
      error: error.message,
    });
  }
};