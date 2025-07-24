// cardDetector.ts
// Определение платёжной системы

export type CardSystem =
  | "visa"
  | "master-card"
  | "mir"
  | "union-pay"
  | "unknown"
  | "";

export function detectCardSystem(cardSystem: string): CardSystem {
  // Уберем все лишние символы, условно "-", и оставим только цифры
  const cleanCardNumber = cardSystem.replace(/\D/g, "");
  // делаем проверку, через регулярные выражения
  // regex.test(string) — проверяет наличие совпадения
  const visaRegex = /^4\d{12}(\d{3})?(\d{3})?$/; // В визе может быть 13 16 или 19 цифр начинается на 4
  if (visaRegex.test(cleanCardNumber)) return "visa";

  // Для мастер кард сложное регулярное выражение, пойдем через substring

  const first2 = +cleanCardNumber.substring(0, 2);
  const first4 = +cleanCardNumber.slice(0, 4);

  if (
    ((first2 >= 51 && first2 <= 55) || (first4 >= 2221 && first4 <= 2720)) &&
    cleanCardNumber.length === 16
  )
    return "master-card";

  // Регулярное выражение для карт МИР
  const mirRegex = /^220[0-4]\d{12}$/;
  if (mirRegex.test(cleanCardNumber)) return "mir";

  // Проверка на UnionPay
  const unionRegex = /^62\d{14,17}$/;
  if (unionRegex.test(cleanCardNumber)) return "union-pay";

  return "unknown";
}
