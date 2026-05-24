export type ActivityOption = {
  id: keyof typeof ACTIVITY_OPTION_IDS;
  trainingCount: string;
};

export const ACTIVITY_OPTION_IDS = {
  sedentary: "sedentary",
  light: "light",
  normal: "normal",
  regular: "regular",
  hard: "hard",
} as const;

export const activityOptions: ActivityOption[] = [
  {
    id: "sedentary",
    trainingCount: "0-1",
  },
  {
    id: "light",
    trainingCount: "1-3",
  },
  {
    id: "normal",
    trainingCount: "3-5",
  },
  {
    id: "regular",
    trainingCount: "5-7",
  },
  {
    id: "hard",
    trainingCount: "7-9",
  },
];
