import Room from "../../model/chat-schema/roomModel.js";
import Item from "../../model/report_schema/itemModel.js";

export const createChatRoom = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { otherUserId, itemId } = req.body;

    if (!userId || !otherUserId || !itemId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (userId === otherUserId) {
      return res.status(400).json({
        success: false,
        message: "You cannot create a chat with yourself",
      });
    }

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }
    const existingRoom = await Room.findOne({
      members: { $all: [userId, otherUserId] },
    });

    if (existingRoom) {
      return res.status(200).json({
        success: true,
        message: "Chat room already exists",
        room: existingRoom,
      });
    }

    const room = await Room.create({
      members: [userId, otherUserId],
      admin: userId,
      item: {
        itemId: item._id,
        title: item.title,
        category: item.category,
        imageUrl: item.images?.[0] || null, 
        type: item.type,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Chat room created successfully",
      room,
    });
  } catch (error) {
    console.error("Create chat room error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
