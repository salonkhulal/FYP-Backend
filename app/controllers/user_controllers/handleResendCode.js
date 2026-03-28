import TempUser from "../../model/user_schema/temp_user_schema/index.js";
import generateToekn from "../../services/generateToken.js";
import { sendEmail } from "../../services/nodemailer/index.js";

export const handleResendCode = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });
    const { confirmCode, codeDueTime } = generateToekn();
    const tempUser = await TempUser.findOneAndUpdate(
      { email },
      { confirmCode, codeDueTime },
      { new: true }
    );
    if (!tempUser) {
      return res.status(404).json({ message: "Temporary user not found" });
    }
    await sendEmail(
      email,
      "verify",
      { code: confirmCode }
    );
    return res.status(200).json({
      message: "Verification code resent successfully",
    });
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error?.message,
    });
  }
}