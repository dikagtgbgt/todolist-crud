import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

// Helper untuk navigation yang lebih aman
export const safeNavigate = (
  navigation: StackNavigationProp<RootStackParamList>,
  routeName: keyof RootStackParamList,
  params?: any
) => {
  try {
    navigation.navigate(routeName, params);
  } catch (error) {
    console.error('Navigation error:', error);
  }
};

// Helper untuk replace navigation yang lebih aman
export const safeReplace = (
  navigation: StackNavigationProp<RootStackParamList>,
  routeName: keyof RootStackParamList,
  params?: any
) => {
  try {
    navigation.replace(routeName, params);
  } catch (error) {
    console.error('Navigation error:', error);
  }
}; 