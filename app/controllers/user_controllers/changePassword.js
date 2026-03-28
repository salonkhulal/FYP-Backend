import User from "../../model/user_schema/index.js";
import bcrypt from "bcrypt";

export const changePassword = async (req, res) => {
  try {
    const { id } = req.user;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Both old and new passwords are required." });
    }

    const user = await User.findById(id).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }


    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect." });
    }
    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({ message: error.message });
  }
};
