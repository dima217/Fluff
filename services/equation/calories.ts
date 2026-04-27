export function calculateDailyCalories({
    weight,  
    height, 
    age,     
    gender,  
    activity, 
  }: {
    weight: number;
    height: number;
    age: number;
    gender: 'male' | 'female' | 'other';
    activity: string | null;
  }): number | null {
    if (!weight || !height || !age) return null;
  
    let bmr: number;
  
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else if (gender === 'female') {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 78;
    }
  
    let multiplier = 1.2;
  
    switch ((activity ?? '').toLowerCase()) {
      case 'running':
      case 'cycling':
      case 'swimming':
        multiplier = 1.55;
        break;
      case 'walking':
        multiplier = 1.375;
        break;
    }
  
    const total = bmr * multiplier;
  
    return total > 0 ? Number(total.toFixed()) : null;
}