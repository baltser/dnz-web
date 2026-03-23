// import { PrismaClient } from '@prisma/client'

// declare global {
//   var __db__: PrismaClient | undefined
// }

// // ✅ Prisma 7 — просто new PrismaClient() (читает из schema.prisma)
// export const prisma = globalThis.__db__ ?? new PrismaClient()

// if (process.env.NODE_ENV !== 'production') {
//   globalThis.__db__ = prisma
// }

// export default prisma

// export default {
//   user: {
//     findUnique: async () => null,
//     findMany: async () => [],
//     create: async (data: unknown) => ({
//       id: Date.now().toString(),
//       name: (data as any).name,
//       email: (data as any).email,
//       password: 'fake_hash'
//     })
//   }
// } as any
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
})

const adapter = new PrismaPg(pool)
export const prisma = new PrismaClient({ adapter })