export const BookingDetails={
    firstName: "Automation"+ randomString(3),
    lastName: "Test",
    email:"yogendra@holisto.com",
    phone: "2154567890",
    request: "automation test booking",
    cardNumber: "4242 4242 4242 4242",
    expirationDate: "0530",
    securityCode: "123",
    zipCode: "04986",
}

export function randomString(length = 3) {
  const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return Array.from({ length }, () =>
    letters.charAt(Math.floor(Math.random() * letters.length))
  ).join('');
}
