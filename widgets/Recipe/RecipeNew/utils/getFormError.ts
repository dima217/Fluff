import { FieldErrors, FieldValues } from "react-hook-form";

export function getFormError(
  errors: FieldErrors<FieldValues>,
  path: string
): string | undefined {
  const parts = path.split(".");
  let current: unknown = errors;

  for (const part of parts) {
    if (!current || typeof current !== "object") {
      return undefined;
    }

    current = (current as Record<string, unknown>)[part];
  }

  if (
    current &&
    typeof current === "object" &&
    "message" in current &&
    current.message
  ) {
    return String(current.message);
  }

  return undefined;
}
