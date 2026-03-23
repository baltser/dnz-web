import { prisma } from '../../utils/db'


export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const updates = body as Array<{ userId: number; rule: string }>

  if (!Array.isArray(updates) || updates.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Неверный формат данных',
    })
  }

  try {
    const promises = updates.map(({ userId, rule }) =>
      prisma.user.update({
        where: { id: userId },
        data: { rule_name: rule }
      })
    )

    await Promise.all(promises)

    return { success: true }
  } catch (e: any) {
    console.error('Error assigning roles:', e)
    throw createError({
      statusCode: 500,
      statusMessage: 'Ошибка назначения ролей',
    })
  }
})