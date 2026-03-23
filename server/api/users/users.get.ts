import { prisma } from '../../utils/db'

export default defineEventHandler(async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      rule_name:true
    },
  })

  return users
})