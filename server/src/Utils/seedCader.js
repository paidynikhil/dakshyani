import { Cader } from "../models/Cader.js";

export const seedCaders = async () => {
  try {
    const caders = [
      {
        id: 1,
        caderName: "Wealth Advisor",
        percentage: 10,
        promotionTarget: 1500000,
        promotionRequirement: "₹15,00,000 business",
        level: 1
      },
      {
        id: 2,
        caderName: "Senior Wealth Advisor",
        percentage: 3,
        promotionTarget: 2,
        promotionRequirement: "2 Advisor Promotion",
        level: 2
      },
      {
        id: 3,
        caderName: "Marketing Manager",
        percentage: 2,
        promotionTarget: 2,
        promotionRequirement: "2 Senior Advisors or 4 Advisors Promotion",
        level: 3
      },
      {
        id: 4,
        caderName: "Senior Marketing Manager",
        percentage: 1,
        promotionTarget: 2,
        promotionRequirement: "2 Marketing Managers Promotion",
        level: 4
      },
      {
        id: 5,
        caderName: "Asst General Manager",
        percentage: 1,
        promotionTarget: 2,
        promotionRequirement: "2 Senior Marketing Managers Promotion",
        level: 5
      },
      {
        id: 6,
        caderName: "Deputy General Manager",
        percentage: 1,
        promotionTarget: 2,
        promotionRequirement: "2 Asst General Managers Promotion",
        level: 6
      },
      {
        id: 7,
        caderName: "General Manager",
        percentage: 1,
        promotionTarget: 2,
        promotionRequirement: "2 Deputy General Managers Promotion",
        level: 7
      },
      {
        id: 8,
        caderName: "Marketing Director",
        percentage: 1,
        promotionTarget: 2,
        promotionRequirement: "2 General Managers Promotion",
        level: 8
      },
      {
        id: 9,
        caderName: "CEO",
        percentage: 1,
        promotionTarget: 2,
        promotionRequirement: "2 Marketing Directors Promotion",
        level: 9
      }
    ];
    
    await Cader.deleteMany({});
    
    await Cader.insertMany(caders);
    
    console.log("✅ Caders seeded successfully");
    
  } catch (error) {
    console.error("❌ Error seeding caders:", error);
    throw error;
  }
};