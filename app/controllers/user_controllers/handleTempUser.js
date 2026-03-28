import TempUser from "../../model/user_schema/temp_user_schema/index.js";
import generateToekn from "../../services/generateToken.js";
import {sendEmail} from "../../services/nodemailer/index.js";
import User from "../../model/user_schema/index.js";

export const handleTempUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;


    const existingTempUser = await User.findOne({ email });
    if (existingTempUser) {
      return res.status(400).json({
        message: "User with this email already exists",
        error: null,
      });
    }
const {confirmCode, codeDueTime} = generateToekn();


    const newTempUser = new TempUser({
      userName,
      email,
      password,
      confirmCode,
      codeDueTime,
    });

    await newTempUser.save();
    await sendEmail(
      email,
      "verify",
      { code: confirmCode }
    );
    const safeTempUser = newTempUser.toObject();
    delete safeTempUser.password;
    delete safeTempUser.confirmCode;
    delete safeTempUser.codeDueTime;
    return res.status(201).json({
      message: "Temporary user created successfully",
      tempUser: safeTempUser ,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error?.message,
    });
  }
};
