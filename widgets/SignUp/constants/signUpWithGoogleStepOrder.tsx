import Age from "../components/AgeScreen";
import CheatMealDay from "../components/CheatMealDayScreen";
import Height from "../components/HeightScreen";
import Sex from "../components/SexScreen";
import { SportActivityScreen } from "../components/SportActivityScreen";
import Weight from "../components/WeightScreen";

export const renderGoogleSignUpStepComponent = (step: number) => {
    switch (step) {
      case 0:
        return <Sex />;
      case 1:
        return <Age />;
      case 2:
        return <Height />;
      case 3:
        return <Weight />;
      case 4:
        return <SportActivityScreen />;
      case 5:
        return <CheatMealDay />;
      default:
        return null;
    }
  };