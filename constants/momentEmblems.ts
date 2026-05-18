import type { ImageSourcePropType } from 'react-native';

const DRINKS_WITH_FRIENDS_MATCHER = /drinks with friends|table talks/i;
const GO_DEEP_MATCHER = /go deep|deep stuff|deep talk/i;
const DATE_NIGHT_MATCHER = /date night/i;
const ON_THE_ROAD_MATCHER = /on the road|road trip/i;
const IKIGAI_MATCHER = /ikigai/i;
const GRANDPARENTS_MATCHER = /grandparents|con mi abuela|with grandparents/i;
const BREAK_THE_ICE_MATCHER = /break the ice/i;

/** Banner colors sampled from each category emblem image (solid fills, no gradient). */
export type MomentBannerTheme = {
  bg: string;
  labelColor: string;
  titleColor: string;
  borderColor: string;
};

const DEFAULT_BANNER_THEME: MomentBannerTheme = {
  bg: '#E8EDE4',
  labelColor: 'rgba(45, 90, 71, 0.65)',
  titleColor: '#243D33',
  borderColor: 'rgba(45, 90, 71, 0.14)',
};

const MOMENT_BANNER_THEMES: ReadonlyArray<{ matcher: RegExp; theme: MomentBannerTheme }> = [
  {
    matcher: DRINKS_WITH_FRIENDS_MATCHER,
    theme: {
      bg: '#E24B2E',
      labelColor: 'rgba(255, 255, 255, 0.72)',
      titleColor: '#FFFFFF',
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
  },
  {
    matcher: GO_DEEP_MATCHER,
    theme: {
      bg: '#E2D4EF',
      labelColor: 'rgba(92, 61, 140, 0.65)',
      titleColor: '#4A3270',
      borderColor: 'rgba(92, 61, 140, 0.16)',
    },
  },
  {
    matcher: DATE_NIGHT_MATCHER,
    theme: {
      bg: '#F2B8C8',
      labelColor: 'rgba(107, 42, 45, 0.65)',
      titleColor: '#6B2A2D',
      borderColor: 'rgba(107, 42, 45, 0.14)',
    },
  },
  {
    matcher: ON_THE_ROAD_MATCHER,
    theme: {
      bg: '#B5DAE8',
      labelColor: 'rgba(30, 77, 69, 0.65)',
      titleColor: '#1E4D45',
      borderColor: 'rgba(30, 77, 69, 0.14)',
    },
  },
  {
    matcher: IKIGAI_MATCHER,
    theme: {
      bg: '#F0EBDF',
      labelColor: 'rgba(74, 95, 58, 0.65)',
      titleColor: '#4A5F3A',
      borderColor: 'rgba(74, 95, 58, 0.14)',
    },
  },
  {
    matcher: GRANDPARENTS_MATCHER,
    theme: {
      bg: '#C9D9C5',
      labelColor: 'rgba(28, 64, 53, 0.65)',
      titleColor: '#1C4035',
      borderColor: 'rgba(28, 64, 53, 0.14)',
    },
  },
  {
    matcher: BREAK_THE_ICE_MATCHER,
    theme: {
      bg: '#D4E8E0',
      labelColor: 'rgba(45, 90, 71, 0.65)',
      titleColor: '#2D584F',
      borderColor: 'rgba(45, 90, 71, 0.14)',
    },
  },
];

function resolveMomentBannerTheme(momentIdOrName: string): MomentBannerTheme {
  for (const { matcher, theme } of MOMENT_BANNER_THEMES) {
    if (matcher.test(momentIdOrName)) return theme;
  }
  return DEFAULT_BANNER_THEME;
}

export function getMomentBannerTheme(
  momentIdOrName: string | null | undefined
): MomentBannerTheme {
  if (!momentIdOrName) return DEFAULT_BANNER_THEME;
  return resolveMomentBannerTheme(momentIdOrName);
}

export function getMomentEmblemSource(
  momentIdOrName: string | null | undefined
): ImageSourcePropType | undefined {
  if (!momentIdOrName) {
    return undefined;
  }

  if (DRINKS_WITH_FRIENDS_MATCHER.test(momentIdOrName)) {
    return require('../assets/moments/drinks-with-friends.png');
  }

  if (GO_DEEP_MATCHER.test(momentIdOrName)) {
    return require('../assets/moments/go-deep.png');
  }

  if (DATE_NIGHT_MATCHER.test(momentIdOrName)) {
    return require('../assets/moments/date-night.png');
  }

  if (ON_THE_ROAD_MATCHER.test(momentIdOrName)) {
    return require('../assets/moments/on-the-road.png');
  }

  if (IKIGAI_MATCHER.test(momentIdOrName)) {
    return require('../assets/moments/ikigai.png');
  }

  if (GRANDPARENTS_MATCHER.test(momentIdOrName)) {
    return require('../assets/moments/grandparents.png');
  }

  return undefined;
}
