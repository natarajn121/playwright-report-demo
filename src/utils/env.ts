import * as fs from 'fs';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';

const ENCRYPTED_ENV_FILE = '.env.enc';

const key = crypto.scryptSync('mysecret123', 'salt', 32);
const iv = Buffer.alloc(16, 0); // 16-byte IV filled with 0s

function decrypt(encryptedText: string) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function loadDecryptedEnv() {
  const decryptedEnv: Record<string, string> = {};
  const content = fs.readFileSync(ENCRYPTED_ENV_FILE, 'utf-8');
  content.split('\n').forEach(line => {
    if (!line.includes('=')) return;
    const [key, value] = line.split('=');
    if (key && value) {
      decryptedEnv[key] = decrypt(value.trim());
    }
  });
  return decryptedEnv;
}

const decrypted = loadDecryptedEnv();

export const ENV = {
  username: decrypted.SF_USERNAME || '',
  password: decrypted.SF_PASSWORD || ''
};
