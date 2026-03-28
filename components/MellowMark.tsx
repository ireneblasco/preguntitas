import Svg, { Path, Rect } from 'react-native-svg';

type MellowMarkProps = {
  size?: number;
};

/** Ícono tipo squircle: "m" orgánica sobre lima (variante superior izquierda de la marca). */
export function MellowMark({ size = 40 }: MellowMarkProps) {
  const bg = '#D9ED82';
  const fg = '#2D5A47';
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Rect width={100} height={100} rx={30} ry={30} fill={bg} />
      <Path
        d="M 27 74 L 27 33 L 50 58 L 73 33 L 73 74"
        stroke={fg}
        strokeWidth={11}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}
