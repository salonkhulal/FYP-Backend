import Room from "../../model/chat-schema/roomModel.js";
import mongoose from "mongoose";

export const getUserRooms = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const rooms = await Room.find({
      members: { $in: [userId] },
    })
      .populate([
        {
          path: "members",
          select: "userName email userImage",
        },
        {
          path: "admin",
          select: "userName email userImage",
        },
        {
          path: "item",
            select: "title type description",
        },
        {
          path: "lastMessage",
          populate: {
            path: "sender",
            select: "userName userImage",
          },
        },
      ])
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    console.error("Get user rooms error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
