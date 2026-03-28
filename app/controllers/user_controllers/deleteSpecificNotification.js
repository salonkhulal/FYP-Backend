import Notification from "../../model/notification_schema/index.js";

export const deleteSingleNotification = async (req, res) => {
  try {
    const user = req.user;      
    const { notificationId } = req.params;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      userId: user?.id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found or access denied",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Delete notification error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete notification",
    });
  }
};
