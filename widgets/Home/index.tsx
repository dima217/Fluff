import { useTranslation } from "@/hooks/useTranslation";
import AllSection from "./components/AllSection";
import CaloriesBaseSection from "./components/CaloriesBaseSection";
import RecipesSection from "./components/RecipesSection";
import VideosSection from "./components/VideosSection";

interface HomeContentProps {
  selected: string;
}

const HomeContent = ({ selected }: HomeContentProps) => {
  const { t } = useTranslation();

  switch (selected) {
    case t("home.videos"):
      return <VideosSection />;

    case t("home.recipes"):
      return <RecipesSection />;

    case t("home.caloriesBase"):
      return <CaloriesBaseSection />;

    case t("home.all"):
    default:
      return <AllSection />;
  }
};

export default HomeContent;
