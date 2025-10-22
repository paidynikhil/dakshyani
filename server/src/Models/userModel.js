import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    googleId:{
      type: String
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      default: "User",
    },
    password: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
    fcmToken: { type: String },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.post("save", function (error, doc, next) {
  if (error.code === 11000 && error.keyPattern?.email) {
    next(new Error("A user with this email already exists. Please log in instead."));
  } else {
    next(error);
  }
});

export const User = mongoose.model("User", userSchema);
