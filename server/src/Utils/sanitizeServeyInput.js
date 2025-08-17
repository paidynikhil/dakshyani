import mongoose from "mongoose";

export const sanitizeSurveyInput = (data) => {
  const enums = {
    deliveryType: ["hard copy", "whatsapp", "by mail", "others"],
    inhouseStatus: ["pending", "ongoing", "completed", "postponed","cancel"],
    purpose: ["buying", "sell", "development", "bank loan", "others"],
    applicantStatus: ["responded", "not responded", "post ponded", "cancel", "other"],
    overallStatus: ["completed", "pending", "ongoing","postponed","cancel"],
  };

  for (const [key, validValues] of Object.entries(enums)) {
    const value = data[key];
    if (!validValues.includes(value)) {
      data[key] = null;
    }
  }

  ["projectName", "mappedBy", "assign"].forEach(key => {
    const value = data[key];
    if (!mongoose.Types.ObjectId.isValid(value)) {
      data[key] = null;
    }
  });

  return data;
};