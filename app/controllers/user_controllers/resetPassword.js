import User from "../../model/user_schema/index.js";

export const resetPassword = async (req, res) => {
    try{
        const { resetToken, newPassword } = req.body;

        const user = await User.findOne({
            resetPasswordLink: resetToken,
            resetPasswordLinkExpire: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        user.password = newPassword;
        user.resetPasswordLink = null;
        user.resetPasswordLinkExpire = null;

        await user.save();

        return res.status(200).json({ message: "Password has been reset successfully" });

    }catch(error){ 
        console.log(error);
        return res.status(500).json({message:"Internal server error"});
    }
}