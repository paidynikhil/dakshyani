import passport from "passport";
import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../Models/userModel.js";
import generateToken from "../Utils/jwt.js";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email: profile.emails?.[0]?.value }],
        });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value,
          });
        } else {
          user.googleId = user.googleId || profile.id;
          await user.save();
        }

        const token = generateToken(user);

        return done(null, { user, token });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((userData, done) => {
  done(null, { id: userData.user.id, token: userData.token });
});

passport.deserializeUser(async (data, done) => {
  try {
    const user = await User.findById(data.id);
    if (user) {
      user.token = data.token;
    }
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
