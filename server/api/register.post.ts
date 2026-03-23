// import { defineEventHandler, readBody, createError } from 'h3'
import { prisma } from '../utils/db'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { name, email, password } = body as {
    name: string
    email: string
    password: string
  }

  if (!name || !email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Поля name, email и password обязательны',
    })
  }

  if (password.length < 6) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Пароль должен быть не меньше 6 символов',
    })
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Пользователь с таким email уже существует',
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await prisma.user.create({
      data: {
        username: name,
        email,
        password: hashedPassword, 
        rule_name: 'guest',
      },
    })

    return {
      success: true,
      id: user.id,
      name: user.username,
      email: user.email,
    }
  } catch (e: any) {
    console.error('Register error:', e)

    if (e.statusCode) throw e

    throw createError({
      statusCode: 500,
      statusMessage: 'Ошибка сервера при регистрации',
    })
  }
})
