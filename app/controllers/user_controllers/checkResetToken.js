import User from "../../model/user_schema/index.js";

const checkResetToken = async (req,res) => {
    try{
        const { resetToken } = req.body;

        const user = await User.findOne({
            resetPasswordLink: resetToken
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }
        return res.status(200).json({ message: "Valid reset token" });
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal server error"});
    }
}
export default checkResetToken;