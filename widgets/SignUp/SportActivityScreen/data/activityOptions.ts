export type ActivityOption = {
  label: string;
  trainingCount: string;
  description: string;
};

export const activityOptions: ActivityOption[] = [
  {
    label: "Sedentary lifestyle",
    trainingCount: "0",
    description: "Sedentary lifestyle is a great way to stay in shape.",
  },
  {
    label: "Light physical activity",
    trainingCount: "1-3",
    description: "Light physical activity is a great way to stay in shape.",
  },
  {
    label: "Normal physical activity",
    trainingCount: "3-5",
    description: "Normal physical activity is a great way to stay in shape.",
  },
  {
    label: "Regular training",
    trainingCount: "5-7",
    description: "Regular training is a great way to stay in shape.",
  },
  {
    label: "Hard physical activity",
    trainingCount: "7-9",
    description: "Hard physical activity is a great way to stay in shape.",
  },
];