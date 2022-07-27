const randomLowerCaseCharCode = () =>
  [1, 2, 3]
    .map(() => String.fromCharCode(97 + Math.floor(Math.random() * 25)))
    .join('');

export const generateRandomCashboxId = (prefix: string = 'my_test_cashbox_') =>
  `${prefix}${randomLowerCaseCharCode()}`;
