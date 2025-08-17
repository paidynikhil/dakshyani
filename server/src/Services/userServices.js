import { User } from "../Models/userModel.js";
import bcrypt from "bcrypt";
import generateToken from "../Utils/jwt.js";

export const userRegister = async (data) => {
  const { name, email, phoneNumber, password, confirmPassword } = data;

  if (!name || !email || !password || !confirmPassword) {
    throw new Error("All fields are required");
  }

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) throw new Error("User with this email already exists");

  const user = await User.create({
    name,
    email: email.toLowerCase().trim(),
    phoneNumber,
    role: "User",
    password,
  });

  return user;
};

export const userLogin = async (email, password, fcmToken) => {
  if (!email || !password) throw new Error("Email and password are required");

  const user = await User.findOne({ email: email.toLowerCase().trim(), role: "User" });
  if (!user) throw new Error("User with this email does not exist");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  if (fcmToken) {
    user.fcmToken = fcmToken;
    await user.save();
  }

  const token = generateToken(user);

  return {
    token,
    userId: user._id,
    name: user.name,
    role: "User",
  };
};

export const getUsersService = async (page, limit) => {
  const skip = (page - 1) * limit;

  const [users, total, active, inactive] = await Promise.all([
    User.find().select("-password").skip(skip).limit(limit),
    User.countDocuments(),
    User.countDocuments({ status: true }),
    User.countDocuments({ status: false }),
  ]);

  return {
    users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    stats: {
      totalUsers: total,
      activeUsers: active,
      inactiveUsers: inactive,
    },
  };
};

export const toggleUserStatusService = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new Error("User not found");

  user.status  = !user.status ;
  return await user.save();
};