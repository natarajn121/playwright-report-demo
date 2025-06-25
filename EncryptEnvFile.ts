import * as crypto from 'crypto';
import * as fs from 'fs';

const key = crypto.scryptSync('mysecret123', 'salt', 32);
const iv = Buffer.alloc(16, 0);

const mode = process.argv[2];
const file = '.env';

function encrypt(text: string) {
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(encryptedText: string) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

if (mode === 'encrypt') {
  const content = fs.readFileSync(file, 'utf-8').split('\n');
  const encrypted = content
    .map(line => {
      if (line.startsWith('#') || !line.includes('=')) return line;
      const [key, value] = line.split('=');
      return `${key}=${encrypt(value.trim())}`;
    })
    .join('\n');
  fs.writeFileSync(`${file}.enc`, encrypted);
  console.log('.env file encrypted to .env.enc');
} else if (mode === 'decrypt') {
  const content = fs.readFileSync(`${file}.enc`, 'utf-8').split('\n');
  const decrypted = content
    .map(line => {
      if (line.startsWith('#') || !line.includes('=')) return line;
      const [key, value] = line.split('=');
      return `${key}=${decrypt(value.trim())}`;
    })
    .join('\n');
  fs.writeFileSync(file, decrypted);
  console.log('.env.enc file decrypted to .env');
} else {
  console.log(`❓ Please pass 'encrypt' or 'decrypt' (e.g., npx ts-node EncryptEnvFile.ts encrypt)`);
}
