import crypto from 'crypto'

const algorithm = 'aes-256-cbc'

// ✅ ФИКСИРОВАННЫЕ ключи ТОЧНОЙ длины
const ENCRYPTION_KEY = 'my-super-secret-key-12345678901234567890123456789012' // 32 символа!
const ENCRYPTION_IV = 'my-fixed-iv-123456789abcdef0' // 16 символов!

const key = Buffer.alloc(32)
Buffer.from(ENCRYPTION_KEY, 'utf8').copy(key)

const iv = Buffer.alloc(16)  
Buffer.from(ENCRYPTION_IV, 'utf8').copy(iv)

console.log('🔑 Key:', key.length, 'bytes OK!')
console.log('🔑 IV:', iv.length, 'bytes OK!')

export function encrypt(text: string): string {
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return encrypted
}

export function decrypt(encrypted: string): string {
  const decipher = crypto.createDecipheriv(algorithm, key, iv)
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}