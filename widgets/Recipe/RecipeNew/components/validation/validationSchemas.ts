import * as yup from "yup";

type TranslateFn = (key: string) => string;

export const createRecipeStepsConfig = (t: TranslateFn) => [
  {
    schema: yup.object({
      name: yup
        .string()
        .required(t("recipe.validation.nameRequired"))
        .min(3, t("recipe.validation.nameMin"))
        .max(100, t("recipe.validation.nameMax")),
      ccal: yup.number().required(t("recipe.validation.ccalRequired")),
      ingredients: yup
        .string()
        .required(t("recipe.validation.ingredientsRequired"))
        .min(3, t("recipe.validation.ingredientsMin"))
        .max(100, t("recipe.validation.ingredientsMax")),
      mediaUrl: yup.string().required(t("recipe.validation.photoRequired")),
    }),
    defaultValues: {
      name: "",
      ccal: 0,
      ingredients: "",
      mediaUrl: "",
    },
  },
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
  {
    schema: yup.object({
      videoUrl: yup.string().required(t("recipe.validation.videoRequired")),
    }),
    defaultValues: {
      videoUrl: "",
    },
  },
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
