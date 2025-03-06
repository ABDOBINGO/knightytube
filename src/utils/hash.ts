function generateRandomString(length: number): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from(
    { length },
    () => charset[Math.floor(Math.random() * charset.length)]
  ).join('');
}

export function generateScriptHash(): string {
  const timestamp = Date.now().toString(36);
  const random = generateRandomString(4);
  return `${timestamp}-${random}`;
}

export function isValidScriptHash(hash: string): boolean {
  return /^[a-z0-9]+-[a-zA-Z0-9]{4}$/.test(hash);
}