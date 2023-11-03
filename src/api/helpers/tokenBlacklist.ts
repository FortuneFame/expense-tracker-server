let tokenBlacklist: string[] = [];

export const addToBlacklist = (token: string) => {
  tokenBlacklist.push(token);
}

export const isTokenBlacklisted = (token: string): boolean => {
  return tokenBlacklist.includes(token);
}

export const removeFromBlacklist = (token: string) => {
  tokenBlacklist = tokenBlacklist.filter(tokenBlacklist => tokenBlacklist !== token);
}
