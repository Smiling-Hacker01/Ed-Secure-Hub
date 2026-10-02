import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export async function hashPassword(plainText: string): Promise<string> {
  return bcrypt.hash(plainText, SALT_ROUNDS);
}

export async function verifyPassword(plainText: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plainText, hash);
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}
