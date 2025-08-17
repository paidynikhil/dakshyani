import { Location } from "../Models/locationModel.js";

export const createLocationService = async (data) => {
  const location = new Location(data);
  return await location.save();
};

export const getAllLocationsService = async () => {
  return await Location.find();
};

export const getLocationByIdService = async (id) => {
  return await Location.findById(id);
};

export const updateLocationService = async (id, data) => {
  return await Location.findByIdAndUpdate(id, data, { new: true });
};

export const deleteLocationService = async (id) => {
  return await Location.findByIdAndDelete(id);
};
