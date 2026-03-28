import { Router } from "express";
import { handleTempUser } from "../controllers/user_controllers/handleTempUser.js";
import { handleResendCode } from "../controllers/user_controllers/handleResendCode.js";
import createUserAfterVerification from "../controllers/user_controllers/createUserAfterVerification.js";
import { generateForgetPassLink } from "../controllers/user_controllers/generateForgetPassLink.js";
import checkResetToken from "../controllers/user_controllers/checkResetToken.js";
import { resetPassword } from "../controllers/user_controllers/resetPassword.js";
import passport from "passport";
import { generateToken } from "../services/jsontoken/index.js";
import getAuthenticatedUserData from "../controllers/user_controllers/getAuthenticatedUserData.js";
import deleteCookie from "../controllers/user_controllers/deleteCookie.js";
import upload from "../services/multer/uploadUserImage.js";
import { uploadProfileImage } from "../controllers/user_controllers/uploadUserImage.js";
import { deleteProfileImage } from "../controllers/user_controllers/deleteUserImage.js";
import { updateProfile } from "../controllers/user_controllers/updateProfile.js";
import { changePassword } from "../controllers/user_controllers/changePassword.js";
import uploadItemImages from "../services/multer/itemImage.js";
import { handleReport } from "../controllers/report_controllers/handleReportItems.js";
import { getAllReports } from "../controllers/report_controllers/getAllReports.js";
import { deleteReportById } from "../controllers/report_controllers/deleteReport.js";
import {getLostFoundReports} from "../controllers/report_controllers/getLostFoundReports.js";
import { getAllUsers } from "../controllers/user_controllers/getAllUsers.js";
import { updateUserStatus } from "../controllers/user_controllers/updateUserStatus.js";
import { deleteUserById } from "../controllers/user_controllers/deleteUserById.js";
import { getAllNotifications } from "../controllers/user_controllers/getAllNotification.js";
import { deleteSingleNotification } from "../controllers/user_controllers/deleteSpecificNotification.js";
import { clearAllNotifications } from "../controllers/user_controllers/clearAllNotification.js";
import { markAllNotificationsAsRead } from "../controllers/user_controllers/markNotificationRead.js";
import { updateItemStatus } from "../controllers/report_controllers/updateItemStatus.js";
import { getAllMatches } from "../controllers/report_controllers/getAllMatches.js";
import { deleteSingleMatch } from "../controllers/report_controllers/deleteSingleMatch.js";
import { getUserRooms } from "../controllers/chat_controllers/getUserRoom.js";
import { deleteRoom } from "../controllers/chat_controllers/deleteUserRoom.js";
import uploadMessageImage from "../services/multer/uploadMessageImage.js";
import uploadChatImage from "../controllers/chat_controllers/handleUploadChatImage.js";
import { createChatRoom } from "../controllers/chat_controllers/createChatRoom.js";
import { getRoomMessages } from "../controllers/chat_controllers/getRoomMessages.js";

const userRoutes = Router();

userRoutes.post('/tempUser', handleTempUser);
userRoutes.patch('/resend-code', handleResendCode);
userRoutes.post('/create-user', createUserAfterVerification);
userRoutes.post('/reset-password-link', generateForgetPassLink);
userRoutes.post('/check-reset-token', checkResetToken);
userRoutes.post('/reset-password', resetPassword);
userRoutes.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {

        if (err) {
            return res.status(500).json({
                message: 'Error in login',
                status: 500
            });
        }
        if (!user) {

            if (info && info.status === 401) {
                return res.status(401).json({ message: "User is not Registered." });
            }

            if (info && info.status === 402) {
                return res.status(402).json({ message: "Incorrect Password." });
            }

            if (info && info.status === 403) {
                return res.status(403).json({ message: "User is banned." });
            }

            return res.status(400).json({ message: info?.message || "Login failed" });
        }
        const token = generateToken({ id: user._id });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });
        const safeUser = user.toObject();
        delete safeUser.password;
        delete safeUser.resetPasswordLink;
        delete safeUser.resetPasswordLinkExpire;

        return res.status(200).json({
            message: "Logged in successfully",
            user: safeUser,
        });

    })(req, res, next);
});

userRoutes.get('/google',passport.authenticate('google'));

userRoutes.get('/callback/google',passport.authenticate('google',{ failureRedirect: `${process.env.FAILURE_URL}?reason=suspended`,session:false }),(req, res) => {
    const token = generateToken({ id: req.user._id });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.redirect(process.env.FRONTEND_URL);
  });
userRoutes.get('/get-user-data', getAuthenticatedUserData);
userRoutes.delete('/logout', deleteCookie);
userRoutes.get("/all-users",getAllUsers);
userRoutes.patch("/user-status/:id",updateUserStatus);
userRoutes.delete("/delete-user/:id",deleteUserById);

userRoutes.post("/user-image",upload.single("image"),uploadProfileImage);
userRoutes.delete("/user-image", deleteProfileImage);
userRoutes.patch("/update-profile", updateProfile);
userRoutes.post("/change-password", changePassword);
userRoutes.post(
  "/report-item",
   uploadItemImages.array("images", 3),
  handleReport
);

userRoutes.get('/reports',getAllReports);
userRoutes.delete('/delete-report/:id',deleteReportById);
userRoutes.get('/get-lost-found-reports',getLostFoundReports);
userRoutes.get('/all-notifications',getAllNotifications);
userRoutes.delete("/clear-all-notification",clearAllNotifications);
userRoutes.delete("/clear-single/:notificationId", deleteSingleNotification);
userRoutes.patch("/notifications/mark-all-read", markAllNotificationsAsRead);
userRoutes.patch("/update-item-status/:itemId/:userId",updateItemStatus);
userRoutes.get("/get-all-matches", getAllMatches);
userRoutes.delete('/delete-match/:matchId',deleteSingleMatch);


userRoutes.post("/create-chat-room",createChatRoom);
userRoutes.get("/get-rooms/:userId", getUserRooms);
userRoutes.delete("/delete-room/:roomId", deleteRoom);
userRoutes.post("/upload-chat-image",uploadMessageImage.single("image"), uploadChatImage);
userRoutes.get("/room-messages/:roomId", getRoomMessages);
export default userRoutes;