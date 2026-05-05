import * as yup from "yup";

export interface RequestFormData {
  title: string;
  screenshot: string;
  description: string;
}

export const supportSchema = yup.object({
  title: yup.string().required("Title обязателен"),
  screenshot: yup.string().required("Screenshot"),
  description: yup.string().required("Пароль обязателен"),
});
