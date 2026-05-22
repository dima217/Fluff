import { Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const IMAGE_MIN_WIDTH = 200;
export const IMAGE_MAX_WIDTH = Math.min(SCREEN_WIDTH * 0.58, 272);
export const GRID_GAP = 2;
export const ALBUM_HEIGHT = 220;
export const SINGLE_IMAGE_HEIGHT = 200;
export const MAX_ALBUM_ITEMS = 10;
