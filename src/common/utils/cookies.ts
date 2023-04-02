export function setCookies(res, token, expires): boolean {
  if (!token || !expires) {
    return false;
  }

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    path: '/',
    expires,
  });
  return true;
}
