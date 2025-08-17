import { ServiceType } from "../Models/serviceTypeModel.js";

export const createServiceType = async (data) => {
  return await ServiceType.create(data);
};

export const getAllServiceTypes = async () => {
  return await ServiceType.find().sort({ name: 1 });
};

export const getServiceTypeById = async (id) => {
  return await ServiceType.findById(id);
};

export const updateServiceType = async (id, data) => {
  return await ServiceType.findByIdAndUpdate(id, data, { new: true });
};

export const deleteServiceType = async (id) => {
  return await ServiceType.findByIdAndDelete(id);
};
