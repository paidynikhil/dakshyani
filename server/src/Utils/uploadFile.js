import multer from "multer";
import fs from "fs";
import path from "path";

export const getUploader = (folderName) => {
  const baseUploadPath = path.join(process.cwd(), "src", "uploads", folderName);

  if (!fs.existsSync(baseUploadPath)) {
    fs.mkdirSync(baseUploadPath, { recursive: true });
    console.log(`[uploadFile] Created upload path: ${baseUploadPath}`);
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, baseUploadPath),
    filename: (req, file, cb) => {
  const ext = path.extname(file.originalname); // ".pdf"
  const name = path.basename(file.originalname, ext); // "dummy"
  const timestamp = Date.now();
  const sanitized = name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "");
  const finalName = `${sanitized}.${timestamp}${ext}`;
  cb(null, finalName);
}
  });

  const upload = multer({ storage });

  const deleteOldFile = (oldPath) => {
    if (!oldPath) return;
    const absPath = path.join(process.cwd(), "src", oldPath);
    fs.promises.unlink(absPath).catch((err) => {
      if (err.code !== "ENOENT") console.error("Delete failed:", err);
    });
  };

  const getFilePath = (filename) => `/uploads/${folderName}/${filename}`;

  return {
  upload,
  fields: upload.fields.bind(upload),
  single: upload.single.bind(upload),
  array: upload.array.bind(upload),
  deleteOldFile,
  getFilePath,
};
};
