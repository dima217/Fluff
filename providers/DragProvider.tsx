import { DragContext } from "@/contexts/DragContext";
import { ReactNode } from "react";
import { useSharedValue } from "react-native-reanimated";

type Props = {
  children: ReactNode;
};

export const DragProvider = ({ children }: Props) => {
  const dropZoneLayout = useSharedValue({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const isOverDropZone = useSharedValue(false);

  const setIsOverDropZone = (v: boolean) => {
    isOverDropZone.value = v;
  };

  return (
    <DragContext.Provider
      value={{
        dropZoneLayout,
        isOverDropZone,
        setIsOverDropZone,
      }}
    >
      {children}
    </DragContext.Provider>
  );
};
