import { getCipher } from '../../utils/password-chipher'

export default defineEventHandler(async () => {
  const cipher = getCipher()
  
  const addresses = await prisma.listAddress.findMany({
    select: {
      id: true,
      address: true,
      ip_address: true,
      created_by: {
        select: {
          id: true,
          username: true,
          email: true,
          rule_name: true
        }
      },
      entrances: {
        select: {
          id: true,
          name_entrance: true,
          port: true,
          password: {
            select: {
              id: true,
              encrypted_password: true
            }
          }
        },
        orderBy: {
          name_entrance: 'asc'
        }
      }
    },
    orderBy: {
      address: 'asc'
    }
  })

  // ✅ РАСШИФРОВЫВАЕМ ПАРОЛИ
  const addressesWithDecryptedPasswords = addresses.map(address => ({
    ...address,
    entrances: address.entrances.map(entrance => ({
      ...entrance,
      password: entrance.password ? {
        ...entrance.password,
        decrypted_password: cipher.decrypt(entrance.password.encrypted_password)
      } : null
    }))
  }))

  return addressesWithDecryptedPasswords
})
// export default defineEventHandler(async () => {
//   const addresses = await prisma.listAddress.findMany({
//     select: {
//       id: true,
//       address: true,
//       ip_address: true,
//       // Информация о создателе
//       created_by: {
//         select: {
//           id: true,
//           username: true,
//           email: true,
//           rule_name: true
//         }
//       },
//       // Подъезды с полной информацией
//       entrances: {
//         select: {
//           id: true,
//           name_entrance: true,
//           port: true,
//           // Пароль устройства
//           password: {
//             select: {
//               id: true,
//               encrypted_password: true
//             }
//           }
//         },
//         orderBy: {
//           name_entrance: 'asc'
//         }
//       }
//     },
//     orderBy: {
//       address: 'asc'
//     }
//   })

//   return addresses
// })
