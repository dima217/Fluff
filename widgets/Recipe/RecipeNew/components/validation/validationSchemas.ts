import * as yup from "yup";

export const baseInfoSchema = yup.object({
  name: yup
    .string()
    .required("Recipe name is required")
    .min(3, "Minimum 3 characters")
    .max(100, "Maximum 100 characters"),
  ccal: yup.number().required("Calories are required"),
  ingredients: yup
    .string()
    .required("Ingredients are required")
    .min(3, "Minimum 3 characters")
    .max(100, "Maximum 100 characters"),
  mediaUrl: yup.string().required("Media file is required"),
});

export const cookingProcessSchema = yup.object({
  steps: yup
    .array()
    .of(
      yup.object({
        title: yup.string().required("Step title is required"),
        description: yup.string().required("Step description is required"),
        stepMediaUrl: yup.string(),
      })
    )
    .min(1, "Add at least one cooking step")
    .required("Cooking steps are required"),
});

export const tutorialSchema = yup.object({
  videoUrl: yup.string().required("Video is required"),
  tutorialName: yup
    .string()
    .required("Recipe name is required")
    .min(3, "Minimum 3 characters")
    .max(100, "Maximum 100 characters"),
  tutorialDescription: yup.string().required("Step description is required"),
});

export const previewSchema = yup.object({});

export const stepsConfig = [
  {
    schema: baseInfoSchema,
    defaultValues: {
      name: "",
      ccal: 0,
      ingredients: "",
      mediaUrl: "",
    },
  },
  {
    schema: cookingProcessSchema,
    defaultValues: {
      steps: [{ title: "", description: "", stepMediaUrl: "" }],
    },
  },
  {
    schema: tutorialSchema,
    defaultValues: {
      videoUrl: "",
      tutorialName: "",
      tutorialDescription: "",
    },
  },
  {
    schema: previewSchema,
    defaultValues: {},
  },
];
