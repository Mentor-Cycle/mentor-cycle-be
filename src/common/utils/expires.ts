export function generateExpiresAt(rememberMe: boolean) {
  const expireRanges = {
    ONE_HOUR_IN_MILLISECONDS: 86400000 / 24,
    ONE_DAY_IN_MILLISECONDS: 86400000,
  };

  const expireSession = rememberMe
    ? expireRanges.ONE_DAY_IN_MILLISECONDS
    : expireRanges.ONE_HOUR_IN_MILLISECONDS;

  const expires = new Date(Date.now() + expireSession);

  return {
    expires,
    expireSession,
  };
}
