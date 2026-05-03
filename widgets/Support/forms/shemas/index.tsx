import * as yup from "yup";

export interface RequestFormData {
    title: string;
    screenshot: string;
    description: string;
}
  
export const supportSchema = yup.object({
    title: yup
      .string()
      .required("Title обязателен")
      .min(10, "Title должен содержать не менее 10 символов"),
    screenshot: yup
      .string()
      .required("Screenshot"),
    description: yup
      .string()
      .required("Пароль обязателен")
      .min(10, "Пароль должен содержать минимум 10 символов")
      .max(15, "Пароль должен содержать максимум 15 символов"),
});