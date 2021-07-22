import numeral from "numeral";

export function formatNumber(number: number, format: string): string {
  return numeral(number).format(format);
}

export function getPercentage(available: number, total: number): number {
  return Math.round((available / total) * 100);
}

export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function fromSnackCase(value: string): string {
  return capitalize(value.replaceAll("_", " "));
}
