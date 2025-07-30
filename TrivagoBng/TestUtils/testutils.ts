export function randomString(length = 3) {
  const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return Array.from({ length }, () =>
    letters.charAt(Math.floor(Math.random() * letters.length))
  ).join('');
}

export function randomNumber(length = 5) {
  const digits = '0123456789';
  return Array.from({ length }, () =>
    digits.charAt(Math.floor(Math.random() * digits.length))
  ).join('');
}

export function randomAlphanumeric() {
  const upper = randomString(1).toUpperCase();
  const lower = randomString(5);
  const number = randomNumber(3);
  return `${upper}${lower}@${number}`;
}

export function randomEmail(domain = "example.com") {
  return `user_${randomString(5).toLowerCase()}${randomNumber(3)}@${domain}`;
}
