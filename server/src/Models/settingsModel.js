import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
    accountNumber: {type: String},
    accountName: {type: String},
    ifscCode: {type: String},
    bankName: {type: String},
    upiId: {type: String},
    qrCode: {type: String},
}, {timestamps: true});

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;