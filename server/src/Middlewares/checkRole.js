import dotenv from "dotenv";
dotenv.config();

const MAIN_SECRET = process.env.MAIN_SECRET;
if (!MAIN_SECRET) {
  throw new Error("MAIN_SECRET is not set in the environment variables!");
}
const checkRoles = (allowedRoles = []) => {
  return (req, res, next) => {
    try {

      if (!req.user) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
        return res.status(401).json({ error: "Access denied. You do not have permission to perform this action." });
      }

      next();
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  };
};

export default checkRoles;
