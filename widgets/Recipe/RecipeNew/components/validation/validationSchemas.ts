import * as yup from "yup";

type TranslateFn = (key: string) => string;

export const createRecipeStepsConfig = (t: TranslateFn) => [
  // Step 0: Base info
  {
    schema: yup.object({
      name: yup
        .string()
        .required(t("recipe.validation.nameRequired"))
        .min(3, t("recipe.validation.nameMin"))
        .max(100, t("recipe.validation.nameMax")),
      ccal: yup.number().optional(),
      description: yup.string().optional(),
      mediaUrl: yup.string().required(t("recipe.validation.photoRequired")),
      cookHours: yup.string().optional(),
      cookMinutes: yup.string().optional(),
    }),
    defaultValues: {
      name: "",
      ccal: 0,
      description: "",
      mediaUrl: "",
      cookHours: "",
      cookMinutes: "",
    },
  },
  // Step 1: Ingredients
  {
    schema: yup.object({
      selectedProducts: yup
        .array()
        .default([])
        .test(
          "at-least-one-ingredient",
          t("recipe.validation.ingredientsMin"),
          function (value) {
            const custom = this.parent.customProducts as unknown[] | undefined;
            return (value?.length ?? 0) + (custom?.length ?? 0) > 0;
          },
        ),
      customProducts: yup.array().default([]),
    }),
    defaultValues: {
      selectedProducts: [],
      customProducts: [],
    },
  },
  // Step 2: Cooking process
  {
    schema: yup.object({
      steps: yup
        .array()
        .of(
          yup.object({
            title: yup
              .string()
              .required(t("recipe.validation.stepTitleRequired")),
            description: yup
              .string()
              .required(t("recipe.validation.stepDescriptionRequired")),
            stepMediaUrl: yup.string(),
          })
        )
        .min(1, t("recipe.validation.stepsMin"))
        .required(t("recipe.validation.stepsRequired")),
    }),
    defaultValues: {
      steps: [{ title: "", description: "", stepMediaUrl: "" }],
    },
  },
  // Step 3: Tutorial
  {
    schema: yup.object({
      videoUrl: yup.string().required(t("recipe.validation.videoRequired")),
    }),
    defaultValues: {
      videoUrl: "",
    },
  },
  // Step 4: Preview
  {
    schema: yup.object({
      makePublic: yup.boolean().required(),
      submitToSystem: yup.boolean().nullable(),
    }),
    defaultValues: {
      makePublic: false,
      submitToSystem: false,
    },
  },
];
