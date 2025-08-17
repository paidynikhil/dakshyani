import ScheduledCall from "../Models/scheduleCallModel.js";

export const createScheduledCall = async (data) => {
  return await ScheduledCall.create(data);
};

export const getAllScheduledCalls = async (filters = {}) => {
  return await ScheduledCall.find(filters)
    .populate("requiredServices", "name")
    .sort({ scheduledDate: 1 });
};

export const getScheduledCallById = async (id) => {
  return await ScheduledCall.findById(id);
};

export const updateScheduledCall = async (id, data) => {
  return await ScheduledCall.findByIdAndUpdate(id, data, { new: true });
};

export const deleteScheduledCall = async (id) => {
  return await ScheduledCall.findByIdAndDelete(id);
};
    