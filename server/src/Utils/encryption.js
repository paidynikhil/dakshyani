import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const ENCRYPTION_SECRET = process.env.TOKEN_ENCRYPTION_SECRET;
const ENCRYPTION_IV = process.env.TOKEN_ENCRYPTION_IV;

if (!ENCRYPTION_SECRET || !ENCRYPTION_IV) {
  throw new Error("Encryption secret or IV is not set in environment variables!");
}

const algorithm = "aes-256-cbc";

export const encryptToken = (token) => {
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(ENCRYPTION_SECRET, "hex"),
    Buffer.from(ENCRYPTION_IV, "hex")
  );

  let encrypted = cipher.update(token, "utf8");
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString("hex");
};

export const decryptToken = (encryptedToken) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(ENCRYPTION_SECRET, "hex"),
    Buffer.from(ENCRYPTION_IV, "hex")
  );

  let decrypted = decipher.update(Buffer.from(encryptedToken, "hex"));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
