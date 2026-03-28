import { View, StyleSheet, ViewStyle } from 'react-native';
import { MellowMark } from './MellowMark';

type AppLogoProps = {
  /** Tamaño del ícono squircle */
  size?: number;
  /** Conservado por compatibilidad; el mark siempre incluye el fondo de marca. */
  withCircle?: boolean;
  style?: ViewStyle;
};

export function AppLogo({ size = 40, style }: AppLogoProps) {
  return (
    <View style={[styles.wrap, { width: size, height: size }, style]}>
      <MellowMark size={size} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
