import { Server } from "socket.io";
import Message from "../../model/chat-schema/messageModel.js";
import Room from "../../model/chat-schema/roomModel.js";
import Notification from "../../model/notification_schema/index.js";

let ioInstance;
const connectedUsers = new Map();

export const sendNotification = async (data) => {
  const notification = await Notification.create(data);
  await notification.populate([
    {
      path: "userId",
      select: "userName email",
    },
    {
      path: "relatedTo",
      select: "userName email",
    },
  ]);
  const socketId = connectedUsers.get(data.userId.toString());
  if (socketId) {
    ioInstance.to(socketId).emit("notification", notification);
  }
};

const runSocket = (server) => {
  ioInstance = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  ioInstance.on("connection", (socket) => {
    const { userId } = socket.handshake.query;
    if (userId) {
      connectedUsers.set(userId, socket.id);
      console.log(`User ${userId} connected with socket ID: ${socket.id}`);
    }

    socket.on("joinRoom", async (roomId) => {
      try {
        const room = await Room.findById(roomId);
        if (!room) {
          return socket.emit("roomJoinError", { 
            roomId, 
            message: "Room not found" 
          });
        }
        const isMember = room.members.some(memberId => 
          memberId.toString() === userId
        );
        
        if (!isMember) {
          return socket.emit("roomJoinError", { 
            roomId, 
            message: "You are not a member of this room" 
          });
        }

        socket.join(roomId);
        console.log(`User ${userId} joined room: ${roomId}`);
        
        socket.emit("roomJoined", { roomId });
        
      } catch (error) {
        console.error("Error joining room:", error);
        socket.emit("roomJoinError", { 
          roomId, 
          message: "Failed to join room" 
        });
      }
    });

    socket.on("leaveRoom", (roomId) => {
      socket.leave(roomId);
      console.log(`User ${userId} left room: ${roomId}`);
    });

    socket.on("sendMessage", async (data) => {
      try {
        const { roomId, content, messageType, fileUrl, senderId } = data;
        console.log(`User ${senderId} sending message to room ${roomId}`);
        
        if (!roomId || !senderId) {
          return socket.emit("error", { message: "Missing required fields" });
        }

        const room = await Room.findById(roomId);
        if (!room) {
          return socket.emit("error", { message: "Room not found" });
        }

        const isMember = room.members.some(memberId => 
          memberId.toString() === senderId.toString()
        );
        
        if (!isMember) {
          return socket.emit("error", { message: "You are not a member of this room" });
        }

        const messageData = {
          sender: senderId,
          room: roomId,
          messageType: messageType || "text",
        };

        if (messageType === "text") {
          if (!content || content.trim() === "") {
            return socket.emit("error", { message: "Message content cannot be empty" });
          }
          messageData.content = content;
        } else if (messageType === "image" && fileUrl) {
          messageData.imageUrl = fileUrl;
        } else {
          return socket.emit("error", { message: "Invalid message type or missing file URL" });
        }


        const newMessage = new Message(messageData);
        await newMessage.save();

        room.lastMessage = newMessage._id;
        room.updatedAt = new Date();
        room.messages.push(newMessage._id);
        await room.save();

        const populatedMessage = await Message.findById(newMessage._id)
          .populate("sender", "userName userImage email");

        console.log(`Message saved: ${newMessage._id} in room ${roomId}`);

        ioInstance.to(roomId).emit("newMessage", populatedMessage);

        socket.emit("messageDelivered", {
          roomId,
          messageId: newMessage._id,
          timestamp: new Date()
        });

      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { 
          message: "Failed to send message",
          error: error.message 
        });
      }
    });

    socket.on("disconnect", () => {
      for (const [uid, sid] of connectedUsers.entries()) {
        if (sid === socket.id) {
          connectedUsers.delete(uid);
          console.log(`User ${uid} disconnected`);
          break;
        }
      }
    });
  });
};

export { ioInstance, connectedUsers };
export default runSocket;