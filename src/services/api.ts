// API service for all album-related requests
const API_BASE_URL = 'https://www.puntosfutbol.com/apialbum/api'
const API_KEY = 'vimSfZ8FCAB7U2ng6cG7YvVQDeIht'

// Generic API envelope
interface ApiEnvelope<T> {
  success: boolean
  errorCode: number
  errorDescription: string | null
  data: T
}

// Data models based on the real API
interface UserCard {
  id: number
  identifier: string | null
  resource: string
  token: number
  type: string
  inAlbum: boolean
}

interface CustomerStickersData {
  id: number
  avatar: string // base64 image data
  name: string
  email: string
  envelopes: number
  userCards: UserCard[]
}

type CustomerStickersResponse = ApiEnvelope<CustomerStickersData>

interface UpdateStickerPayloadItem {
  StickerId: number
  InAlbum: number // 0 or 1
}

type UpdateCustomerStickersResponse = ApiEnvelope<unknown>

export const apiService = {
  async getCustomerStickers(customerId: string): Promise<CustomerStickersResponse> {
    const response = await fetch(`${API_BASE_URL}/CustomerStickers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify({
        Customerid: customerId
      })
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    return await response.json()
  },

  async updateCustomerStickers(customerId: string, stickers: UpdateStickerPayloadItem[]): Promise<UpdateCustomerStickersResponse> {
    const response = await fetch(`${API_BASE_URL}/UpdateCustomerStickers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify({
        Customerid: customerId,
        Stickers: stickers
      })
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    return await response.json()
  },

  async openPack(customerId: string): Promise<CustomerStickersResponse> {
    const response = await fetch(`${API_BASE_URL}/OpenPack`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify({
        Customerid: customerId
      })
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    return await response.json()
  }
}