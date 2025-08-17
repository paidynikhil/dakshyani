import mongoose from "mongoose";

const scheduledCallSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  companyName: String,
  requiredServices: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceType",
      required: true
    }
  ],
  projectDetails: String,
  scheduledDate: { type: String, required: true },
  scheduledTime: { type: String, required: true },
  status: { type: String, enum: ["scheduled", "completed", "cancelled"], default: "scheduled" },
}, { timestamps: true });

const ScheduledCall = mongoose.model("ScheduledCall", scheduledCallSchema);
export default ScheduledCall;
