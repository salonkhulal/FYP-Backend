import { Strategy as LocalStrategy } from "passport-local";
import passport from "passport";
import User from "../../model/user_schema/index.js";

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false, {
            message: "User is not available.",
            status: 401,
          });
        }

        if (user.status === "suspended") {
          return done(null, false, {
            message: "Your account has been suspended. Please contact support.",
            status: 403,
          });
        }

        const isMatch = await user.verifyPassword(password);
        if (!isMatch) {
          return done(null, false, {
            message: "Incorrect password.",
            status: 402,
          });
        }

        return done(null, user, {
          message: "Logged in successfully",
          status: 200,
        });

      } catch (error) {
        return done(error, false, {
          message: "Error in login",
          status: 500,
        });
      }
    }
  )
);
