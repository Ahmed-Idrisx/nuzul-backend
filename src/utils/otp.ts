import bcrypt from "bcrypt";

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function hashOtp(otp: string): Promise<string> {
  return bcrypt.hash(otp, 10);
}

export async function compareOtp(
  otp: string,
  codeHash: string,
): Promise<boolean> {
  return bcrypt.compare(otp, codeHash);
}
