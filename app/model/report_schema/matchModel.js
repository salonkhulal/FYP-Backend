import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const MatchSchema = new Schema(
  {
    lostItem: {
      type: Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    foundItem: {
      type: Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    confidence: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Match = models.Match || model("Match", MatchSchema);
export default Match;