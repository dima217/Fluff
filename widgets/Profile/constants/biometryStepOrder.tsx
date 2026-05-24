import Age from "@/widgets/SignUp/components/AgeScreen";
import Height from "@/widgets/SignUp/components/HeightScreen";
import Sex from "@/widgets/SignUp/components/SexScreen";
import Weight from "@/widgets/SignUp/components/WeightScreen";

export const renderBiometryStepComponent = (step: number) => {
  switch (step) {
    case 0:
      return <Sex />;
    case 1:
      return <Age />;
    case 2:
      return <Height />;
    case 3:
      return <Weight />;
    default:
      return null;
  }
};
