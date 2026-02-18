import { Controller, useFormContext } from "react-hook-form";
import { SportActivityList } from "./components/SportActivityList";

export const SportActivityScreen = () => {
  const { control } = useFormContext();

  return (
  <Controller
    control={control}
    name="sportActivity"
    render={({ field: { value, onChange } }) => (
      <SportActivityList value={value} onChange={onChange} />
    )}
  />
);
};