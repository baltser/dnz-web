
interface Entrance {
  id: number
  name_entrance: string
  port: number
  password?: {
    id: number
    decrypted_password: string
  } | null
  address: {
    id: number
    address: string
    ip_address?: string | null
  }
}

const IMPORTANT = ["Request:", "Opening", "RFID"]
const logBuffer: string[] = []

const processLog = (rawText: string): string => {
  const lines = rawText.split('\n')
  const tempBuffer: string[] = []
  
  for (const line of lines) {
    if (line.trim()) {
      for (const keyword of IMPORTANT) {
        if (line.includes(keyword)) {
          tempBuffer.push(line)
          break
        }
      }
    }
  }
  
  const recent = tempBuffer.slice(-50)  // ✅ Только последние 50
  
  return recent
    .map(line => line.replace(/[<>]/g, ''))
    .join('\n')
    .trim() || 'Ответ ничего не дал! Проверьте настройки.'
}

export default defineEventHandler(async (event) => {
  const params = getRouterParams(event)
  const id = params.id as string
  const endpoint = params.endpoint as string
  
  if (!id || isNaN(parseInt(id))) {
    throw createError({ statusCode: 400, statusMessage: 'Неверный ID' })
  }
  
  const entranceId = parseInt(id, 10)
  const entrance = await $fetch<Entrance>(`/api/address/entrance/${entranceId}`)
  
  if (!entrance?.address?.ip_address || !entrance.port) {
    throw createError({ statusCode: 400, statusMessage: 'Нет данных подключения' })
  }
  
  const url = `http://${entrance.address.ip_address}:${entrance.port}/${endpoint}`
  const password = entrance.password?.decrypted_password || ''
  
  try {
    const response = await $fetch.raw(url, {
      method: 'GET',
      headers: password ? {
        Authorization: `Basic ${btoa('admin:' + password)}`
      } : {},
      timeout: 10000
    })
    
    const rawText = response._data as string
    const processedLog = processLog(rawText)
    
    return {
      success: true,
      raw: processedLog,
      original: rawText,  // для дебага
      bufferSize: logBuffer.length
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Ошибка запроса',
      status: error.statusCode || 500
    }
  }
})