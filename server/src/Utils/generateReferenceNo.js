import { Counter } from "../Models/counterModel.js";

export const generateReferenceNo = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: "agentRef" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return `KK${String(counter.seq).padStart(6, "0")}`;
};

export const buildAgentPath = async (referredBy) => {
  if (!referredBy) return [];
  
  const parentAgent = await Agent.findOne({ referenceNo: referredBy });
  if (!parentAgent) return [];
  
  // Return parent's path plus parent's referenceNo
  return [...parentAgent.path, parentAgent.referenceNo];
};

export const validateCommissionDistribution = (agents) => {
  // Validate that agents are in correct hierarchy order
  const levels = agents.map(agent => agent.caderId.level);
  
  // Check if levels are in ascending order (lowest to highest)
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] <= levels[i - 1]) {
      return false;
    }
  }
  
  return true;
};

export const calculateCommissionAmount = (plotAmount, percentage) => {
  return (plotAmount * percentage) / 100;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(amount);
};

export const getBusinessProgress = (currentAmount, targetAmount) => {
  const percentage = (currentAmount / targetAmount) * 100;
  return {
    percentage: Math.min(percentage, 100),
    remaining: Math.max(targetAmount - currentAmount, 0),
    achieved: currentAmount >= targetAmount
  };
};

export const canReceiveCommission = (receiverCaderLevel, senderCaderLevel) => {
  return receiverCaderLevel > senderCaderLevel;
};

export const findNextAvailableCadre = (agents, currentLevel) => {
  return agents.find(agent => agent.caderId.level > currentLevel);
};