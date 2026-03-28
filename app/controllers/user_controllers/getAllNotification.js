import Notification from "../../model/notification_schema/index.js";

export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .populate("userId", "userName email")
      .populate("relatedTo", "userName email"); 

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching notifications",
    });
  }
};
