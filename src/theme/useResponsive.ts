import { useWindowDimensions } from 'react-native';

// Base design was done at 390px wide (iPhone 14)
const BASE_WIDTH = 390;

export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const scale = width / BASE_WIDTH;
  const isSmall = width < 360;   // iPhone SE, small Androids
  const isTablet = width >= 768; // iPads, large Android tablets

  // Scale a size value, clamped so it never gets too small or too large
  function rs(size: number, min?: number, max?: number): number {
    const scaled = Math.round(size * (isTablet ? 1.15 : scale));
    if (min !== undefined && scaled < min) return min;
    if (max !== undefined && scaled > max) return max;
    return scaled;
  }

  // Horizontal padding — more on tablets
  const hPad = isTablet ? 48 : isSmall ? 16 : 20;

  return { width, height, scale, isSmall, isTablet, rs, hPad };
}
