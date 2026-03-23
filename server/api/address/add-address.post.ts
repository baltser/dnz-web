import { getCipher } from '../../utils/password-chipher' 
// import { encrypt } from '../../utils/crypto'


interface AddAddressRequest {
  address: string
  ipAddress: string
  entrances: Array<{ name: string; port: number; password: string }>
  userId: number
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<AddAddressRequest>(event)
    const cipher = getCipher()
    console.log('📥 Получены данные:', body)

    const { address, ipAddress, entrances, userId } = body

    if (!address?.trim() || !entrances?.length || !userId) {
      throw createError({ statusCode: 400, statusMessage: 'Неверные данные' })
    }

    const newAddress = await prisma.$transaction(async (tx) => {
      const addressRecord = await tx.listAddress.create({
        data: {
          address: address.trim(),
          ip_address: ipAddress?.trim() || null,
          createdById: userId
        }
      })

      const entranceData = await Promise.all(
        entrances.map(async (entrance) => {
          let passwordId: number | null = null

          if (entrance.password?.trim()) {
            const encryptedPassword = cipher.encrypt(entrance.password)
            
            const passwordRecord = await tx.devicePassword.upsert({
              where: { encrypted_password: encryptedPassword },
              update: {}, 
              create: { encrypted_password: encryptedPassword }
            })

            passwordId = passwordRecord.id
          }

          return {
            name_entrance: entrance.name.trim(),
            port: entrance.port,
            passwordId,
            addressId: addressRecord.id
          }
        })
      )


      await tx.entrance.createMany({ data: entranceData })

      return await tx.listAddress.findUnique({
        where: { id: addressRecord.id },
        include: { entrances: true }
      })
    })

    console.log('✅ СОЗДАНО:', newAddress?.id)
    return { 
      success: true, 
      message: `Адрес "${newAddress?.address}" добавлен!` 
    }

  } catch (error: any) {
    console.error('❌ Ошибка:', error)
    if (error.code === 'P2002') {
      throw createError({ statusCode: 409, statusMessage: 'Адрес уже существует' })
    }
    throw createError({ statusCode: 500, statusMessage: error.message || 'Ошибка сервера' })
  }
})
