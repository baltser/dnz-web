export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID не указан' })
  }
  
  const address = await prisma.listAddress.findUnique({
    where: { id: parseInt(id) },
    include: {
      created_by: {
        select: {
          id: true,
          username: true,
          email: true,
          rule_name: true
        }
      },
      entrances: {
        include: {
          password: true
        }
      }
    }
  })
  
  if (!address) {
    throw createError({ statusCode: 404, statusMessage: 'Адрес не найден' })
  }
  
  const cipher = getCipher() 
  
  return {
    ...address,
    entrances: address.entrances.map(ent => ({
      ...ent,
      password: ent.password ? {
        ...ent.password,
        decrypted_password: cipher.decrypt(ent.password.encrypted_password)
      } : null
    }))
  }
})
