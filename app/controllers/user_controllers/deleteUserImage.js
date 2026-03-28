import User from "../../model/user_schema/index.js";
import fs from "fs";
import path from "path";

export const deleteProfileImage = async (req, res) => {
  try {
    const { id } = req.user;


    const user = await User.findById(id);

    if (!user || !user.userImage) {
      return res.status(400).json({
        message: "No profile image to delete",
      });
    }


    const imagePath = path.resolve(
      "app",
      "uploads",
      user.userImage
    );

 
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }


    await User.findByIdAndUpdate(id, {
      $unset: { userImage: "" },
    });

    return res.status(200).json({
      message: "Profile image deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
