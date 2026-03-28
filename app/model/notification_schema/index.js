import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const notificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true, 
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    read: {
      type: Boolean,
      default: false,
    },
    relatedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false, 
    },
  },
  {
    timestamps: true,
  }
);

const Notification =
  models.Notification || model("Notification", notificationSchema);

export default Notification;
