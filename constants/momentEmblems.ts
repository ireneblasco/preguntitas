import type { ImageSourcePropType } from 'react-native';

const DRINKS_WITH_FRIENDS_MATCHER = /drinks with friends|table talks/i;
const GO_DEEP_MATCHER = /go deep|deep stuff|deep talk/i;
const DATE_NIGHT_MATCHER = /date night/i;
const ON_THE_ROAD_MATCHER = /on the road|road trip/i;
const IKIGAI_MATCHER = /ikigai/i;
const GRANDPARENTS_MATCHER = /grandparents|con mi abuela|with grandparents/i;

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
