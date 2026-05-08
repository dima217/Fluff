import { createContext, useContext } from "react";
import { SharedValue } from "react-native-reanimated";

type DropZone = {
  x: number;
  y: number;
  width: number;
  height: number;
};

interface DragContextType {
  dropZoneLayout: SharedValue<DropZone>;
  isOverDropZone: SharedValue<boolean>;
  setIsOverDropZone: (v: boolean) => void;
}

export const DragContext = createContext<DragContextType | null>(null);

export const useDrag = () => {
  const ctx = useContext(DragContext);
  if (!ctx) throw new Error("DragContext not provided");
  return ctx;
};
