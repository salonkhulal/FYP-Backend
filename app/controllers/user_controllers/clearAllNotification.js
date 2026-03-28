import Notification from "../../model/notification_schema/index.js";

export const clearAllNotifications = async (req, res) => {
  try {
    const user = req.user; 

    await Notification.deleteMany({ userId: user?.id });

    return res.status(200).json({
      success: true,
      message: "All notifications cleared successfully",
    });
  } catch (error) {
    console.error("Clear all notifications error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to clear notifications",
    });
  }
};
