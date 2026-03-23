import { createCipheriv, createDecipheriv } from 'crypto'

export class PasswordCipher {
  private key: Buffer
  private fixedIv: Buffer

  constructor() {
    // ✅ ТОЧНО 32 БАЙТА (64 hex символа)
    this.key = Buffer.from('2a7f8b9c4d1e5f6a3b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a', 'hex')
    // ✅ ТОЧНО 16 БАЙТ (32 hex символа)
    this.fixedIv = Buffer.from('1a2b3c4d5e6f708192a3b4c5d6e7f809', 'hex')
    
    console.log('🔑 Key:', this.key.length, 'bytes')
    console.log('🔑 IV:', this.fixedIv.length, 'bytes')
  }

  encrypt(password: string): string {
    const cipher = createCipheriv('aes-256-cbc', this.key, this.fixedIv)
    let encrypted = cipher.update(password, 'utf8', 'base64')
    encrypted += cipher.final('base64')
    return encrypted
  }

  decrypt(encryptedPassword: string): string {
    const encrypted = Buffer.from(encryptedPassword, 'base64')
    const decipher = createDecipheriv('aes-256-cbc', this.key, this.fixedIv)
    let decrypted = decipher.update(encrypted)
    decrypted = Buffer.concat([decrypted, decipher.final()])
    return decrypted.toString('utf8')
  }
}

export const getCipher = (): PasswordCipher => {
  return new PasswordCipher()
}
