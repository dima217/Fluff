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
  },
  {
    schema: ageSchema,
  },
  {
    schema: heightSchema,
  },
  {
    schema: weightSchema,
  },
  {
    schema: sportActivitySchema,
  },
];
