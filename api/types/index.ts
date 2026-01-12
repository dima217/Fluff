// API Types based on documentation

// Base types
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}

// Auth types
export interface SignUpInitRequest {
  email: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  code: string;
  gender: "male" | "female" | "other";
  birthDate: string; // ISO 8601
  height: number; // 50-300 cm
  weight: number; // 20-500 kg
}

export interface LoginRequest {
  username: string; // email
  password: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}

export interface RecoveryInitRequest {
  username: string; // email
}

export interface RecoveryConfirmRequest {
  username: string; // email
  code: string;
  password: string;
  passwordConfirm: string;
}

// Profile types
export interface ProfileResponse {
  id: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  birthDate: string | null;
  bio: string | null;
  photo: string | null;
  gender: "male" | "female" | "other" | null;
  height: number | null; // cm
  weight: number | null; // kg
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  birthDate?: string; // ISO 8601
  bio?: string;
  photo?: string;
  gender?: "male" | "female" | "other";
  height?: number; // 50-300
  weight?: number; // 20-500
}

// Recipe types
export interface RecipeType {
  id: number;
  name: string;
}

export interface RecipeImage {
  cover: string;
  preview: string;
}

export interface RecipeStepResource {
  position: number;
  source: string;
  type: string;
}

export interface RecipeStep {
  name: string;
  description: string;
  resources: RecipeStepResource[];
}

export interface RecipeStepsConfig {
  steps: RecipeStep[];
}

export interface RecipeResponse {
  id: number;
  user: {
    id: number;
    firstName: string;
    lastName: string;
  } | null;
  name: string;
  type: RecipeType;
  average: number;
  favorite: boolean;
  image: RecipeImage;
  promotionalVideo: string | null;
  description: string | null;
  products: number[];
  fluffAt: string | null;
  calories: number;
  cookAt: number; // seconds
  stepsConfig: RecipeStepsConfig;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecipeRequest {
  name: string;
  recipeTypeId: number;
  image: RecipeImage;
  promotionalVideo?: string;
  description?: string;
  productIds: number[];
  fluffAt?: string; // ISO 8601
  calories: number;
  cookAt: number; // seconds
  stepsConfig: RecipeStepsConfig;
}

export interface UpdateRecipeRequest {
  name?: string;
  recipeTypeId?: number;
  image?: RecipeImage;
  promotionalVideo?: string | null;
  description?: string | null;
  productIds?: number[];
  fluffAt?: string | null;
  calories?: number;
  cookAt?: number;
  stepsConfig?: RecipeStepsConfig;
}

// Recipe upload types
export interface PrepareRecipeUploadRequest {
  coverFilename: string;
  coverSize: number;
  previewFilename: string;
  previewSize: number;
}

export interface PrepareRecipeUploadResponse {
  coverMediaId: string;
  coverUploadUrl: string;
  coverUrl: string;
  previewMediaId: string;
  previewUploadUrl: string;
  previewUrl: string;
}

export interface PrepareStepResourcesUploadRequest {
  resources: {
    filename: string;
    size: number;
    type: string; // 'video' | 'image'
    position: number;
  }[];
}

export interface PrepareStepResourcesUploadResponse {
  resources: {
    mediaId: string;
    uploadUrl: string;
    url: string;
    position: number;
    type: string;
  }[];
}

export interface CreateRecipeWithMediaIdsRequest {
  name: string;
  recipeTypeId: number;
  imageMediaIds: {
    coverMediaId: string;
    previewMediaId: string;
  };
  promotionalVideoMediaId?: string;
  description?: string;
  productIds: number[];
  fluffAt?: string; // ISO 8601
  calories: number;
  cookAt: number;
  stepsConfig: {
    steps: {
      name: string;
      description: string;
      resources: {
        position: number;
        mediaId: string;
        type: string;
      }[];
    }[];
  };
}

export interface ConfirmUploadRequest {
  recipeId: number;
  mediaIds: string[];
}

// Product types
export interface ProductResponse {
  id: number;
  name: string;
  calories: number; // per 100g
  massa: number; // grams
  image: {
    cover: string;
    preview: string;
  } | null;
  countFavorites: number;
  favorite: boolean;
  fluffAt: string | null;
  createdAt: string;
}

export interface CreateProductRequest {
  name: string;
  calories: number; // per 100g
  massa: number; // grams
  image?: {
    cover: string;
    preview: string;
  };
  fluffAt?: string; // ISO 8601
}

export interface UpdateProductRequest {
  name?: string;
  calories?: number;
  massa?: number;
  image?: {
    cover: string;
    preview: string;
  } | null;
  fluffAt?: string | null;
}

// Product upload types
export interface PrepareProductUploadRequest {
  coverFilename: string;
  coverSize: number;
  previewFilename: string;
  previewSize: number;
}

export interface PrepareProductUploadResponse {
  coverMediaId: string;
  coverUploadUrl: string;
  coverUrl: string;
  previewMediaId: string;
  previewUploadUrl: string;
  previewUrl: string;
}

export interface CreateProductWithMediaIdsRequest {
  name: string;
  calories: number;
  massa: number;
  imageMediaIds: {
    coverMediaId: string;
    previewMediaId: string;
  };
  fluffAt?: string;
}

export interface ConfirmProductUploadRequest {
  productId: number;
  mediaIds: string[];
}

// Tracking types
export interface TrackingResponse {
  id: number;
  name: string;
  calories: number;
  recipeId: number | null; // Recipe ID if tracking was created from a recipe
  created: string; // ISO 8601
}

export interface CreateTrackingRequest {
  name?: string; // Required if recipeId is not provided
  calories?: number; // Required if recipeId is not provided
  recipeId?: number; // Optional. If provided, name and calories will be taken from the recipe
}

export interface UpdateTrackingRequest {
  name?: string;
  calories?: number;
}

export interface TrackingStatistics {
  totalCalories: number;
  dateStart: string; // YYYY-MM-DD
  dateEnd: string; // YYYY-MM-DD
}

export interface GetTrackingStatisticsQuery {
  dateStart: string; // YYYY-MM-DD
  dateEnd: string; // YYYY-MM-DD
}

export interface TrackingCalendarDay {
  totalCalories: number;
  records: TrackingResponse[];
}

export interface TrackingCalendar {
  [date: string]: TrackingCalendarDay; // Key is YYYY-MM-DD
}

// Favorites types
export type FavoriteType = "recipe" | "product";

export interface FavoriteItem {
  type: FavoriteType;
  id: number;
  // Recipe or Product data will be here
  [key: string]: any;
}

// OAuth types
export interface OAuthLoginRequest {
  token: string;
  type: "GOOGLE";
}

// Pagination
export interface PaginationQuery {
  page?: number;
  limit?: number;
}

// Search types
export interface SearchRecipesQuery {
  q?: string; // Search query (product names and/or recipe name)
  productIds?: number[]; // Comma-separated list of product IDs
  page?: number;
  limit?: number;
}

export interface SearchProductsQuery {
  q: string; // Search query (product names)
}

// Media types
export interface MediaResponse {
  // Media file stream (blob)
  blob: Blob;
}
