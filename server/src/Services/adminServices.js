import { Admin } from "../Models/adminModel.js";
import generateToken from "../Utils/jwt.js";
import bcrypt from "bcrypt";

export const adminSignUp = async (data) => {
  const existing = await Admin.findOne({ email: data.email.toLowerCase().trim() });
  if (existing) throw new Error("Admin with this email already exists");

  const admin = await Admin.create({
    ...data,
    email: data.email.toLowerCase().trim(),
    role: "Admin"
  });

  return admin;
};

export const adminSignIn = async (email, password, fcmToken) => {
  const admin = await Admin.findOne({ email: email.toLowerCase().trim(), role: "Admin" });
  if (!admin) throw new Error("Admin with this email does not exist");

  console.log("Plain password from req:", password);
  console.log("Hashed password in DB:", admin.password);

  const isMatch = await bcrypt.compare(password, admin.password);
  console.log("Password match?", isMatch);

  if (!isMatch) throw new Error("Invalid credentials");

  if (fcmToken) {
    admin.fcmToken = fcmToken;
    await admin.save();
  }

  const token = generateToken(admin);
  return {
    token,
    userId: admin._id,
    name: admin.name,
    role: "Admin"
  };
};

export const resetPasswordDirect = async (email, newPassword, confirmNewPassword) => {
  const admin = await Admin.findOne({ email: email.toLowerCase().trim(), role: "Admin" });
  if (!admin) throw new Error("Admin not found");

  if (newPassword !== confirmNewPassword) {
    throw new Error("Passwords do not match");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  admin.password = hashedPassword;
  await admin.save();

  return true;
};
