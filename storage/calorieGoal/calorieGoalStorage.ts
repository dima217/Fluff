import { storage } from "../config";

export const calorieGoalStorage = {
  get: () => {
    return storage.getString("calorieGoal");
  },
  set: (calorieGoal: number) => {
    storage.set("calorieGoal", calorieGoal.toString());
  },
  remove: () => {
    storage.delete("calorieGoal");
  },
};