import { DefaultTheme, Colors } from 'react-native-paper';

export const paperTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.yellow700,
    secondary: Colors.grey600,
    error: '#f13a59',    
  },
};