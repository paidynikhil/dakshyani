import { getUploader } from "../Utils/uploadFile.js";

const Uploader = getUploader("paymentSlip");

export const multiUploader = Uploader.upload.fields([
  { name: "images", maxCount: 10 },
  { name: "documents", maxCount: 10 },
  { name: "paymentSlip", maxCount: 1 },
  {name: "qrCode", maxCount: 1},
]);

export const getFilePath = Uploader.getFilePath;
