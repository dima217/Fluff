import type { RecipeResponse, TrackingResponse } from "@/api/types";

export const formatTrackingTime = (dateString: string) => {
  const date = new Date(dateString);

  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const period = hours >= 12 ? "PM" : "AM";

  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

  return `${displayHours}:${minutes} ${period}`;
};

export const groupTrackingRecordsByTime = (records: TrackingResponse[]) => {
  return records.reduce(
    (acc, record) => {
      const timeKey = formatTrackingTime(record.created);

      if (!acc[timeKey]) {
        acc[timeKey] = [];
      }

      acc[timeKey].push(record);

      return acc;
    },
    {} as Record<string, TrackingResponse[]>
  );
};

type TrackingRecordWithRecipe = TrackingResponse & {
  recipe?: RecipeResponse;
};

export const getGroupedTrackingRecords = (
  records: TrackingResponse[],
  recipes: RecipeResponse[] = []
) => {
  const recipesMap = new Map(recipes.map((recipe) => [recipe.id, recipe]));

  return records.reduce(
    (acc, record) => {
      const timeKey = formatTrackingTime(record.created);

      if (!acc[timeKey]) {
        acc[timeKey] = [];
      }

      acc[timeKey].push({
        ...record,
        recipe: record.recipeId ? recipesMap.get(record.recipeId) : undefined,
      });

      return acc;
    },
    {} as Record<string, TrackingRecordWithRecipe[]>
  );
};
