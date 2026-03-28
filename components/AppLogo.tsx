import { View, StyleSheet, ViewStyle } from 'react-native';

const RAY_COUNT = 6;
const RAY_ANGLES = Array.from({ length: RAY_COUNT }, (_, i) => (i * 360) / RAY_COUNT);

type AppLogoProps = {
  /** Tamaño total del logo (círculo + icono). Ej: 56 para splash, 40 para header. */
  size?: number;
  /** Si es true, muestra el círculo de fondo; si false, solo el icono asterisco. */
  withCircle?: boolean;
  style?: ViewStyle;
};

/** Colores del logo: en sintonía con la app (verdes, amarillos, grises). */
const LOGO_COLORS = {
  circleBg: '#F0EDE8', // gris cálido suave
  ray: '#5A6B5A', // verde grisáceo (sintonía con CARD_THEMES)
} as const;

/**
 * Logo tipo asterisco geométrico: estilo iOS, minimalista.
 * Paleta en sintonía con la app (verdes claros, amarillos, grises).
 */
export function AppLogo({ size = 40, withCircle = true, style }: AppLogoProps) {
  const rayLength = Math.round(size * 0.36);
  const rayWidth = Math.max(1.5, Math.round(size * 0.04));
  const iconSize = rayLength * 2;

  const content = (
    <View style={[styles.asteriskWrap, { width: iconSize, height: iconSize }]}>
      {RAY_ANGLES.map((angle) => (
        <View
          key={angle}
          style={[
            styles.ray,
            {
              width: rayWidth,
              height: rayLength,
              left: (iconSize - rayWidth) / 2,
              top: (iconSize - rayLength) / 2,
              transform: [{ rotate: `${angle}deg` }],
            },
          ]}
        />
      ))}
    </View>
  );

  if (!withCircle) {
    return <View style={[styles.noCircle, { width: size, height: size }, style]}>{content}</View>;
  }

  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }, style]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: LOGO_COLORS.circleBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  asteriskWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ray: {
    position: 'absolute',
    backgroundColor: LOGO_COLORS.ray,
    borderRadius: 1,
  },
});
