import * as yup from "yup";

export const emailSchema = yup.object({
  email: yup
    .string()
    .required("Email обязателен")
    .email("Введите корректный email адрес"),
});

export const codeSchema = yup.object({
  code: yup
    .string()
    .required("Код верификации обязателен")
    .min(5, "Код должен содержать минимум 5 символов")
    .max(50, "Код должен содержать максимум 50 символов"),
});

export const passwordSchema = yup.object({
  password: yup
    .string()
    .required("Пароль обязателен")
    .min(8, "Пароль должен содержать минимум 8 символов")
    .max(50, "Пароль должен содержать максимум 50 символов"),
});

export const nameSchema = yup.object({
  firstName: yup
    .string()
    .required("Имя обязательно")
    .min(2, "Имя должно содержать минимум 2 символа")
    .max(50, "Имя должно содержать максимум 50 символов"),
  lastName: yup
    .string()
    .required("Фамилия обязательна")
    .min(2, "Фамилия должна содержать минимум 2 символа")
    .max(50, "Фамилия должна содержать максимум 50 символов"),
});

export const sexSchema = yup.object({
  sex: yup
    .string()
    .oneOf(["male", "female", "other"], "Выберите ваш пол")
    .required("Пол обязателен"),
});

export const ageSchema = yup.object({
  age: yup
    .string()
    .required("Возраст обязателен")
    .test("is-valid-age", "Введите корректный возраст", (value) => {
      const age = parseInt(value || "0", 10);
      return age >= 1 && age <= 120;
    }),
});

export const heightSchema = yup.object({
  height: yup
    .string()
    .required("Рост обязателен")
    .test("is-valid-height", "Введите корректный рост", (value) => {
      const height = parseFloat(value || "0");
      return height >= 50 && height <= 300;
    }),
});

export const weightSchema = yup.object({
  weight: yup
    .string()
    .required("Вес обязателен")
    .test("is-valid-weight", "Введите корректный вес", (value) => {
      const weight = parseFloat(value || "0");
      return weight >= 20 && weight <= 500;
    }),
});

export const signUpStepsConfig = [
  {
    schema: emailSchema,
    defaultValues: {
      email: "",
    },
  },
  {
    schema: codeSchema,
    defaultValues: {
      code: "",
    },
  },
  {
    schema: passwordSchema,
    defaultValues: {
      password: "",
    },
  },
  {
    schema: nameSchema,
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  },
  {
    schema: sexSchema,
    defaultValues: {
      sex: null,
    },
  },
  {
    schema: ageSchema,
    defaultValues: {
      age: "18",
    },
  },
  {
    schema: heightSchema,
    defaultValues: {
      height: "170",
    },
  },
  {
    schema: weightSchema,
    defaultValues: {
      weight: "70",
    },
  },
];
