import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phoneNumber:{
    type: Number,
  },
  otp: {
    type: String,
    required: true
  },
  name: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 900
  }
});

const Otp = mongoose.model("Otp", otpSchema);
export default Otp;
