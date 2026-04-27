import { RootState } from "@/api";
import ArrowLeft from "@/assets/images/ArrowLeft.svg";
import CheckBox from "@/shared/CheckBox";
import { ThemedText } from "@/shared/ui/ThemedText";
import IngredientsSection from "@/widgets/Recipe/RecipeInfo/components/IngredientsSection";
import { Controller, useFormContext } from "react-hook-form";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

const Preview = ({ onBack }: { onBack: () => void }) => {
  const { getValues, watch, control } = useFormContext();
  const allValues = getValues();
  const profile = useSelector((state: RootState) => state.user.profile)

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.touchableContainer} onPress={onBack}>
        <ArrowLeft />
      </TouchableOpacity>
      <Image
        style={styles.tinyLogo}
        source={{
        uri: allValues.mediaUrl,
      }}/>
      <View>
        <ThemedText type="subtitle">{allValues.name}</ThemedText>
        <ThemedText>{profile?.user.firstName + " " + profile?.user.lastName}</ThemedText>
      </View>
      <ThemedText>{allValues.description}</ThemedText>
      <IngredientsSection products={allValues.ingredients} />
      <View style={styles.checkboxGroup}>
      <Controller 
        control={control}
        name="makePublic"
        render={({ field: { value, onChange } }) => (
         <CheckBox
            title="Make the recipe public"
            checked={value}
            setChecked={onChange}
        />)}
      />
      
      <Controller 
        control={control}
        name="submitToSystem"
        render={({ field: { value, onChange } }) => (
          <CheckBox
            title="Submit a request to be added to the system"
            checked={value}
            setChecked={onChange}
        />)}
      />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },
  touchableContainer: {
    paddingVertical: 10,
  },
  tinyLogo: {
    width: '100%',
    height: '40%',
    borderRadius: 16,
  },
  checkboxGroup: {
    marginTop: 8,
    gap: 12,
  },
});

export default Preview;
