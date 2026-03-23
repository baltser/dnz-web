// import { defineEventHandler, readBody, createError } from 'h3'
import { prisma } from '../utils/db'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { email, password } = body as {
    email: string
    password: string
  }

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email и пароль обязательны',
    })
  }

  try {
    const user = await prisma.user.findFirst({
      where: { email },
    })

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Пользователь не найден',
      })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Неверный пароль',
      })
    }

    return {
      success: true,
      id: user.id.toString(),
      name: user.username ?? user.email.split('@')[0], // fallback на часть email
      email: user.email,
      rule_name: user.rule_name
    }
  } catch (e: any) {
    console.error('Login error:', e)

    if (e.statusCode) throw e

    throw createError({
      statusCode: 500,
      statusMessage: 'Ошибка сервера при входе',
    })
  }
})
