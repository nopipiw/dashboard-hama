import Rule from "../models/rule.model.js";
import { DEFAULT_RULES } from "../seeds/defaultRules.js";

export const ensureDefaultRulesSeeded = async () => {
  const count = await Rule.countDocuments();
  if (count > 0) return;
  await Rule.insertMany(DEFAULT_RULES);
};

