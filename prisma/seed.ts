import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding rules...')

  const rulesEnv = process.env.RULES
  if (!rulesEnv) {
    throw new Error('RULES not set in .env')
  }

  const rules = rulesEnv.split(',').map((r) => r.trim())

  for (const rule_name of rules) {
    await prisma.rule.upsert({
      where: { rule_name: rule_name },
      update: {},
      create: { rule_name },
    })
  }

  console.log('✅ Правила созданы!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
