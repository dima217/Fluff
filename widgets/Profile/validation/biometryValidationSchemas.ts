import {
  ageSchema,
  heightSchema,
  sexSchema,
  sportActivitySchema,
  weightSchema,
} from "@/widgets/SignUp/validation/validationSchemas";

export const biometryStepsConfig = [
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
  {
    schema: sportActivitySchema,
    defaultValues: {
      sportActivity: null,
    },
  },
];
