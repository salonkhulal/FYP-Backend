import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../../model/user_schema/index.js";
import dotenv from "dotenv";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
      scope: ["email", "profile"],
    },
    async (request, accessToken, refreshToken, profile, cb) => {
      try {
        const email = profile._json.email;

        let user = await User.findOne({
          $or: [
            { userId: profile.id },
            { email: email }
          ]
        });

        if (user && user.status === "suspended") {
          return cb(null, false, {
            message: "Your account has been suspended. Please contact support.",
            status: 403,
          });
        }

        if (!user) {
          user = await User.create({
            userId: profile.id,
            userName: profile._json.name,
            email: email,
            userImage: profile._json.picture,
            password: profile.id, 
            provider: "Google",
          });
        }

        return cb(null, user);
      } catch (error) {
        return cb(error, false);
      }
    }
  )
);
