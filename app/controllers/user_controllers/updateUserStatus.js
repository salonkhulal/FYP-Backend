import User from "../../model/user_schema/index.js";

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User status updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user status error:", error);

    return res.status(500).json({
      message: "Failed to update user status",
    });
  }
};
