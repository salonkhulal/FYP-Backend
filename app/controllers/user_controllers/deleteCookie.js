//used for user logout
const deleteCookie = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",                   
    });

    return res.status(200).json({ message: "Logout successfully." });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};
export default deleteCookie;