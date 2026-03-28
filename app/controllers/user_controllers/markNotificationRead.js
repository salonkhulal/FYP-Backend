import Notification from "../../model/notification_schema/index.js";

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const user = req.user?.id;
    console.log("Marking notifications as read for user:", user);

     await Notification.updateMany(
      { userId: user, read: false },
      { $set: { read: true } }
    );
    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Mark notifications as read error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark notifications as read",
    });
  }
};
