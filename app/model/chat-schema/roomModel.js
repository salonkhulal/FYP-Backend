import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const roomSchema = new Schema(
  {
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    item: {
        itemId: { type: Schema.Types.ObjectId, required: true },
      title: { type: String, required: true },
      category: String,
      imageUrl: String,
      type: { type: String },
    },

    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    ],

    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

const Room = models.Room || model("Room", roomSchema);
export default Room;
