import fs from "fs";
import path from "path";
import Room from "../../model/chat-schema/roomModel.js";
import Message from "../../model/chat-schema/messageModel.js";

export const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user?.id;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    if (room.admin.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only room admin can delete this room",
      });
    }

    const messages = await Message.find({ room: roomId });

    for (const message of messages) {
      if (message.messageType === "image" && message.imageUrl) {
        const filePath = path.join(
          process.cwd(),
          "app",
          "uploads",
          message.imageUrl
        );

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    await Message.deleteMany({ room: roomId });

    await Room.findByIdAndDelete(roomId);

    return res.status(200).json({
      success: true,
      message: "Room, messages, and chat files deleted successfully",
    });
  } catch (error) {
    console.error("Delete room error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
