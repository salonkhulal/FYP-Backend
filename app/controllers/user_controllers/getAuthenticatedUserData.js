import User from "../../model/user_schema/index.js";

const getAuthenticatedUserData = async (req,res)=>{
    try{
        const user_id = req.user?.id;
        // console.log(user_id);
        if(user_id)
        {
            const user = await User.findOne({_id:user_id}).lean();
            delete user.password;
            delete user.resetPasswordLink;
            delete user.resetPasswordLinkExpire;
            return res.status(200).json({message:"user data",user})
        }
        return res.status(200).json({message:"null user",user:null})
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Error on getting autheticated User"})
    }
}
export default getAuthenticatedUserData;