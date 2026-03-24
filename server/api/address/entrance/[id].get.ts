export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  const entrance = await prisma.entrance.findUnique({
    where: { id: parseInt(id!) },
    include: {
      password: true,
      address: {  
        select: {
          id: true,
          address: true,
          ip_address: true
        }
      }
    }
  })
  
  if (!entrance) {
    throw createError({ statusCode: 404 })
  }
  
  const cipher = getCipher()
  return {
    ...entrance,
    password: entrance.password ? {
      ...entrance.password,
      decrypted_password: cipher.decrypt(entrance.password.encrypted_password)
    } : null
  }
})
