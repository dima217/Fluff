import * as yup from "yup";

export const emailSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
});

export const sexSchema = yup.object({
  sex: yup
    .string()
    .oneOf(["male", "female"], "Please select your gender")
    .required("Gender is required"),
});

export const ageSchema = yup.object({
  age: yup
    .string()
    .required("Age is required")
    .test("is-valid-age", "Please enter a valid age", (value) => {
      const age = parseInt(value || "0", 10);
      return age >= 1 && age <= 120;
    }),
});

export const heightSchema = yup.object({
  height: yup
    .string()
    .required("Height is required")
    .test("is-valid-height", "Please enter a valid height", (value) => {
      const height = parseInt(value || "0", 10);
      return height >= 100 && height <= 250;
    }),
});

export const weightSchema = yup.object({
  weight: yup
    .string()
    .required("Weight is required")
    .test("is-valid-weight", "Please enter a valid weight", (value) => {
      const weight = parseInt(value || "0", 10);
      return weight >= 30 && weight <= 200;
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
