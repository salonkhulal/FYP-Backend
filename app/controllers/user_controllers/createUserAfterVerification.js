import User from "../../model/user_schema/index.js";
import TempUser from "../../model/user_schema/temp_user_schema/index.js";
import { v4 as uuidv4 } from "uuid";
import { sendNotification } from "../../services/socket/index.js";

const createUserAfterVerification = async (req, res) => {
  try {
    const { email, token } = req.body;

    if (!email || !token) {
      return res.status(400).json({ message: "Email and token are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const userData = await TempUser.findOne({ email });
    if (!userData) {
      return res.status(404).json({ message: "Temporary user not found" });
    }

    const isValid =
      token === userData.confirmCode &&
      new Date() < new Date(userData.codeDueTime);

    if (!isValid) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code" });
    }

    const uuid = uuidv4();

    const newUser = new User({
      userId: uuid, 
      userName: userData.userName,
      email: userData.email,
      password: userData.password,
      userRole: ["user"], 
    });

    await newUser.save();
    await TempUser.deleteOne({ email });

    const admin = await User.findOne({ userRole: "admin" });

    if (admin) {
      await sendNotification({
        userId: admin._id,     
        title: "New User Registered",
        content: `${newUser.userName} has just registered`,
        relatedTo: newUser._id, 
      });
    }


    const safeUser = newUser.toObject();
    delete safeUser.password;
    delete safeUser.resetPasswordLink;
    delete safeUser.resetPasswordLinkExpire;

    return res.status(201).json({
      message: "User created successfully",
      user: safeUser,
    });

  } catch (error) {
    console.error("Create user error:", error);
    return res.status(500).json({
      message: "Server error occurred while creating the user.",
      error: error.message,
    });
  }
};

export default createUserAfterVerification;
