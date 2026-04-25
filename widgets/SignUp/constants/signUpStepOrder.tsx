import Age from "../components/AgeScreen";
import CheatMealDay from "../components/CheatMealDayScreen";
import CodeScreen from "../components/CodeScreen";
import EmailScreen from "../components/EmailScreen";
import Height from "../components/HeightScreen";
import NameScreen from "../components/NameScreen";
import PasswordScreen from "../components/PasswordScreen";
import Sex from "../components/SexScreen";
import { SportActivityScreen } from "../components/SportActivityScreen";
import Weight from "../components/WeightScreen";

export const renderStepComponent = (step: number) => {
    switch (step) {
      case 0:
        return <EmailScreen />;
      case 1:
        return <CodeScreen />;
      case 2:
        return <PasswordScreen />;
      case 3:
        return <NameScreen />;
      case 4:
        return <Sex />;
      case 5:
        return <Age />;
      case 6:
        return <Height />;
      case 7:
        return <Weight />;
      case 8:
        return <SportActivityScreen />;
      case 9:
        return <CheatMealDay />;
      default:
        return null;
    }
  };