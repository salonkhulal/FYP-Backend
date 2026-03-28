import User from "../../model/user_schema/index.js";

export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const { id } = req.user;

    const imagePath = `${id}/userImage/${req.file.filename}`;

    await User.findByIdAndUpdate(
      id,
      { userImage: imagePath },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Profile image uploaded successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
