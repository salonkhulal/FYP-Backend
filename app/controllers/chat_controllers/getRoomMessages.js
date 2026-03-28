import Room from "../../model/chat-schema/roomModel.js";
import Message from "../../model/chat-schema/messageModel.js";
import mongoose from "mongoose";

export const getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user?.id;

    // console.log("Fetching messages for room:", roomId, "User:", userId);

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid room ID format"
      });
    }

    const room = await Room.findById(roomId)
      .populate("members", "_id userName userImage")
      .populate("item", "title type description")
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: "userName userImage"
        }
      });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found"
      });
    }

    const isMember = room.members.some(member => 
      member._id.toString() === userId.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this room"
      });
    }

    const messages = await Message.find({ room: roomId })
      .populate("sender", "userName userImage _id")
      .sort({ createdAt: 1 }); 

    // console.log(`Found ${messages.length} messages for room ${roomId}`);

    const otherMember = room.members.find(member => 
      member._id.toString() !== userId.toString()
    );

    return res.status(200).json({
      success: true,
      messages: messages,
      room: {
        _id: room._id,
        members: room.members,
        otherMember: otherMember,
        item: room.item,
        admin: room.admin,
        lastMessage: room.lastMessage,
        createdAt: room.createdAt,
        updatedAt: room.updatedAt
      }
    });

  } catch (error) {
    console.error("Error fetching room messages:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};