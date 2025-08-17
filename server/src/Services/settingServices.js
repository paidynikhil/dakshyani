import Settings from "../Models/settingsModel.js";
import { getUploader } from "../Utils/uploadFile.js";

const { deleteOldFile, getFilePath } = getUploader("settings");

export const upsertSettingsService = async (data, file) => {
  const existing = await Settings.findOne();

  const filePath = file ? getFilePath(file.filename) : existing?.qrCode;

  if (existing) {
    if (file && existing.qrCode) {
      deleteOldFile(existing.qrCode);
    }

    Object.assign(existing, { ...data, qrCode: filePath });
    return await existing.save();
  }

  const newSettings = new Settings({ ...data, qrCode: filePath });
  return await newSettings.save();
};

export const getSettingsService = async () => {
  const settings = await Settings.findOne();
  if (!settings) throw new Error("Settings not found");
  return settings;
};

export const deleteSettingsService = async () => {
  const settings = await Settings.findOne();
  if (!settings) throw new Error("Settings not found");

  if (settings.qrCode) {
    const { deleteOldFile } = getUploader("settings");
    deleteOldFile(settings.qrCode);
  }

  return await Settings.deleteOne({ _id: settings._id });
};
