// Screen-reader text of #event-help (N-D): only the start of an event (warning) and its result are announced.
// Filler between events and hints of the interaction phase stay silent; the first-meeting hint goes through #banner.
// Returns an i18n key or '' (an empty live region announces nothing and re-arms the next announcement).
export function helpLiveKey(e, hint, feedbackKey) {
  if (e && !e.result) return e.phase === 'warning' && !hint ? 'help.ready' : '';
  return feedbackKey || '';
}
// #banner is announced only when it brings news: a new district, the first-meeting hint, a milestone beyond the best so far, the goal.
export const bannerIsNews = (banner, hint, x, bestAtStart, goal) =>
  !!hint || banner?.kind === 'district' || (!!banner && (banner.value === goal || x > bestAtStart));
