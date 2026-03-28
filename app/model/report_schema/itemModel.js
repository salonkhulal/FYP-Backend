import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const ItemSchema = new Schema(
  {
    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["lost", "found"],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
      address: {
        type: String, 
        trim: true,
      },
    },

    date: {
      type: Date,
      required: true,
    },

    images: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["active", "matched", "claimed", "closed"],
      default: "active",
    },
    contactPhone: {
      type: String,
      required: true,
      trim: true,
    },
    contactEmail: {
      type: String,
      required: true,
      trim: true,
    },
    imageEmbeddings: {
  type: [[Number]], 
  default: []
}
  },
  { timestamps: true }
);
const Item = models.Item || model("Item", ItemSchema);

export default Item;