import numeral from "numeral";
import { BigNumber } from "ethers";

export function parseEther(number: BigNumber): number {
  return Number.parseFloat(number.toString()) / Math.pow(10, 18);
}

export function formatNumber(number: number, format: string): string {
  return numeral(number).format(format);
}

export function parseAndFormatEther(
  number: BigNumber,
  format: string = "0,0.000",
): string {
  return formatNumber(parseEther(number), format);
}

export function getPercentage(available: number, total: number): number {
  return Math.round((available / total) * 100);
}

export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
