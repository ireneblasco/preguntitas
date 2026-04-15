/**
 * Lightweight analytics for MVP. No UI changes—tracking only.
 *
 * Events: app_open, category_opened, question_viewed, premium_cta_clicked.
 * To plug in a provider (e.g. PostHog, Firebase, Amplitude), add the SDK and
 * call it inside track() below. Example for PostHog:
 *   import PostHog from 'posthog-react-native';
 *   posthog.capture(event, params);
 */

export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

function track(event: string, params?: AnalyticsParams): void {
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log('[Analytics]', event, params ?? {});
  }

  // Optional: send to your analytics backend or SDK.
  // Example with PostHog: posthog?.capture(event, params);
  // Example with Firebase: analytics().logEvent(event, params);
}

export const analytics = {
  track,

  /** Call when the app has opened and the user has passed the splash (first meaningful screen). */
  appOpen(): void {
    track('app_open');
  },

  /** Call when the user opens a moment/category to browse questions. */
  categoryOpened(categoryName: string): void {
    track('category_opened', { category: categoryName });
  },

  /** Call when the user views a question (e.g. when the current card changes). */
  questionViewed(questionId: string): void {
    track('question_viewed', { question_id: questionId });
  },

  /**
   * Call when the user taps a premium/upsell CTA.
   * When you add a premium CTA (e.g. in settings or paywall), call:
   *   analytics.premiumCtaClicked();
   */
  premiumCtaClicked(): void {
    track('premium_cta_clicked');
  },
};
