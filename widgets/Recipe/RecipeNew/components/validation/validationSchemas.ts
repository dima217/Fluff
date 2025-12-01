import * as yup from "yup";

export const baseInfoSchema = yup.object({
  name: yup
    .string()
    .required("Название рецепта обязательно")
    .min(3, "Минимум 3 символа")
    .max(100, "Максимум 100 символов"),
  ccal: yup.string().max(500, "Максимум 500 символов"),
  ingredients: yup
    .number()
    .typeError("Введите число")
    .positive("Время должно быть положительным")
    .required("Время приготовления обязательно"),
  mediaUrl: yup.string().max(500),
});

export const cookingProcessSchema = yup.object({
  steps: yup
    .array()
    .of(
      yup.object({
        title: yup.string().required("Заголовок шага обязателен"),
        description: yup.string().required("Описание шага обязательно"),
      })
    )
    .min(1, "Добавьте хотя бы один шаг приготовления")
    .required("Шаги приготовления обязательны"),
});

export const tutorialSchema = yup.object({
  videoUrl: yup.string().max(500),
});

export const stepsConfig = [
  {
    schema: baseInfoSchema,
    defaultValues: { name: "", ccal: "", ingredients: "", mediaUrl: "" },
  },
  {
    schema: cookingProcessSchema,
    defaultValues: { steps: [{ title: "", description: "" }] },
  },
  { schema: tutorialSchema, defaultValues: { videoUrl: "" } },
];
