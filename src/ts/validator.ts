// validator.ts
// Логика алгоритма Луна

export default function isValidCardNumber(cardNumber: string): boolean {
  const reversed = cardNumber
    .replace(/\D/g, "")
    .split("")
    .reverse()
    .map(Number);
  if (reversed.length === 0) return false;
  // аккомулируем все числа с помощью метода reduce
  const sum = reversed.reduce((acc, digit, index) => {
    // нам нужно число через один, 2,4,6 и т.д.
    // счет с 0 по этому второе число будет под индексом 1
    // и его остаток отделения будет 1
    if (index % 2 === 1) {
      let double = digit * 2;
      if (double > 9) double -= 9;
      return acc + double;
    }
    // остальные числа мы просто прибавляем
    return acc + digit;
  }, 0);
  // нужно вернуть булево значение
  // число должно делиться на 10 без остатка
  // если делиться, значит номер карты валидный.
  return sum % 10 === 0;
}
