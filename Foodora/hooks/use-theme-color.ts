import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';  // ඔයාගේ themes.ts path එක correct කරන්න (constants/themes)

type ThemeProps = {
  light?: string;
  dark?: string;
};

export type ColorName = keyof typeof Colors.light;

export function useThemeColor(
  props: ThemeProps,
  colorName: ColorName
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}