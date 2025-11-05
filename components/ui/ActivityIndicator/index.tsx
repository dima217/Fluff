import { ActivityIndicator as NativeActivityIndicator } from "react-native";

import type { ActivityIndicatorProps } from "react-native";

import { Colors } from "@/constants/Colors";

const ActivityIndicator = ({ ...rest }: ActivityIndicatorProps) => {
  return (
    <NativeActivityIndicator size="large" color={Colors.secondary} {...rest} />
  );
};

export default ActivityIndicator;
