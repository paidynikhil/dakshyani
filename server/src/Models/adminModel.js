import mongoose from "mongoose";
import bcrypt from "bcrypt";

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String },
  email: { type: String, unique: true, required: true, set: (value) => value.toLowerCase(), },
  password: { type: String, required: true },
  role: { type: String, default: "Admin" },
  status: {type: Boolean, default: true},
}, { timestamps: true });

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

adminSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const Admin = mongoose.model("Admin", adminSchema);
