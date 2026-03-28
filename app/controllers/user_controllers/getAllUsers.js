import User from "../../model/user_schema/index.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password") 
      .sort({ createdAt: -1 }); 

    return res.status(200).json({
      success: true,
      users,
      totalUsers: users.length,
    });
  } catch (error) {
    console.error("Get all users error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};
