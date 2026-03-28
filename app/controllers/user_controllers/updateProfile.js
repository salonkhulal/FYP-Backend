import User from "../../model/user_schema/index.js";

export const updateProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const { userName, phoneNumber, address } = req.body;

    if (!userName && !phoneNumber && !address) {
      return res.status(400).json({ message: "No fields to update." });
    }


    const updateData = {};
    if (userName) updateData.userName = userName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (address) updateData.address = address;


    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: error.message });
  }
};
