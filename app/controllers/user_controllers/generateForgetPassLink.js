import User from '../../model/user_schema/index.js';
import { sendEmail } from '../../services/nodemailer/index.js';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
dotenv.config();

export const generateForgetPassLink = async (req, res) => {
  const { email } = req.body;

  try {

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = uuidv4();

    user.resetPasswordLink = resetToken;
    user.resetPasswordLinkExpire = Date.now() + 15 * 60 * 1000; 

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;


    await sendEmail(
      email,
      "reset",
      { resetUrl }
    );

    return res.status(200).json({ message: 'Reset password link sent to your email' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
