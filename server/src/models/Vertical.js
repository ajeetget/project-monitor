import mongoose from "mongoose";

const verticalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Vertical = mongoose.model("Vertical", verticalSchema);

export default Vertical;