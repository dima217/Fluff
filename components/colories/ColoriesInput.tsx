import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './styles/calories.input.styles';

type InputMode = 'manual' | 'search';

interface CalorieInputProps {
  onAdd: (foodName: string, calories: number) => void;
}

const CalorieInput: React.FC<CalorieInputProps> = ({ onAdd }) => {
  const [mode, setMode] = useState<InputMode>('manual');
  const [foodName, setFoodName] = useState<string>('');
  const [calories, setCalories] = useState<string>('');

  const handleAdd = () => {
    if (mode === 'manual' && foodName && calories) {
      onAdd(foodName, parseInt(calories));
      setFoodName('');
      setCalories('');
    }
  };

  const handleToggleMode = () => {
    setMode(mode === 'manual' ? 'search' : 'manual');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Daily calorie intake</Text>
        <TouchableOpacity onPress={handleToggleMode} style={styles.toggleButton}>
          <Ionicons name="repeat" size={16} color="#E75480" />
          <Text style={styles.toggleText}>
            {mode === 'manual' ? 'Recipe from Fluff' : 'Your own recipe'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputSection}>
        {mode === 'manual' ? (
          <>
            <Text style={styles.inputLabel}>Food Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Example: Banana, Chicken Breast"
              placeholderTextColor="#888"
              value={foodName}
              onChangeText={setFoodName}
            />

            <Text style={styles.inputLabel}>Calories</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Example: 95"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={calories}
              onChangeText={setCalories}
            />
          </>
        ) : (
          <>
            <Text style={styles.inputLabel}>Food Name</Text>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={18} color="#888" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search"
                placeholderTextColor="#888"
                // Somewhere there will be search logic yup
              />
            </View>
          </>
        )}
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CalorieInput;