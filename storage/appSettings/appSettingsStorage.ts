import { BaseObjectStorage } from "../config";

export interface AppSettings {
  notificationsEnabled: boolean;
  publishRecipesEnabled: boolean;
  nutrientTrackingEnabled: boolean;
}

const defaults: AppSettings = {
  notificationsEnabled: true,
  publishRecipesEnabled: true,
  nutrientTrackingEnabled: true,
};

class AppSettingsStorage extends BaseObjectStorage<AppSettings> {
  isNotificationsEnabled(): boolean {
    return this.get().notificationsEnabled;
  }

  isPublishRecipesEnabled(): boolean {
    return this.get().publishRecipesEnabled;
  }

  isNutrientTrackingEnabled(): boolean {
    return this.get().nutrientTrackingEnabled;
  }
}

export const appSettingsStorage = new AppSettingsStorage(
  "appSettings",
  defaults,
);
