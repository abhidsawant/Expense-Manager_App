import { useContext } from 'react';
import { ThemeContext } from '../state/ThemeContext';

export function useTheme() {
  return useContext(ThemeContext);
}
