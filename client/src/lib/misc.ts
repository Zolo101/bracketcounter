export const stringHexToNum = (hex: string) => parseInt(hex.substring(1), 16)
export const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max)
