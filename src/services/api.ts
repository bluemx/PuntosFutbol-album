// API service for all album-related requests

// API service for all album-related requests

//const API_PROD_URL = 'https://album.puntosfutbol.com/gateway/api'
const API_TEST_URL = 'https://puntosfutbol2026.com/gatewaytest/api'

// Si existe la variable de entorno VITE_API_TEST_URL, úsala.
// Si no existe, usa siempre producción por defecto.
/*
const API_BASE_URL =
  (import.meta as any).env?.VITE_API_TEST_URL || API_PROD_URL
*/

const API_BASE_URL = API_TEST_URL

// Log vistoso cuando estamos en modo TEST
const __TEST_URL = (import.meta as any).env?.VITE_API_TEST_URL
if (__TEST_URL) {
  try {
    const banner = '%c TEST API ACTIVE'
    const style1 = 'color:#fff;background:#9333ea;padding:4px 8px;border-radius:4px;font-weight:700; font-size:40px;'
    console.log(banner, style1)
  } catch (_) {
    console.log('TEST API ACTIVE')
  }
}

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
  acRegId: number
}

interface PackToOpen {
  packTypeId: number
  packs: number
}

export interface StickerToView {
  stickerId: number
  identifier: number
  resource: string
  token: number
  stickerType: string
  inAlbum: boolean
  customerStickerStatusID: number
  customerStickerStatus: string
  nickNameGave: string
  avatarImage: string
}

interface CustomerStickersData {
  id: number
  avatar: string // base64 image data
  name: string
  email: string
  packsToOpen: PackToOpen[]
  userCards: UserCard[]
  stickersToView: StickerToView[]
}

type CustomerStickersResponse = ApiEnvelope<CustomerStickersData>

interface UpdateStickerPayloadItem {
  StickerId: number
  InAlbum: number // 0 or 1
}

type UpdateCustomerStickersResponse = ApiEnvelope<unknown>

export interface Friend {
  friendCustomerID: number
  nickname: string
  avatarImage: string // base64 image
  notInAlbum: number
}

type FriendsResponse = ApiEnvelope<Friend[]>

interface SendGiftStickerItem {
  customerStickerId: number
  ACRegId: number
}

// Removed unused SendGiftPayload interface

interface SendGiftData {
  message: string
}

type SendGiftResponse = ApiEnvelope<SendGiftData>

// Exchange/Trading interfaces
interface ExchangeOfferItem {
  customerStickerId: number
  ACRegId: number
}

interface ExchangeWantedItem {
  ACRegId: number
}

// Removed unused TryExchangePayload interface

export interface ExchangeMatch {
  resultId: number
  message: string
  customerId: number
  firstName: string
  email: string
  stickers: number
}

type TryExchangeResponse = ApiEnvelope<ExchangeMatch[]>

// Current Exchanges interfaces
export interface CurrentExchange {
  exchangeId: number
  customerIdOffers: number
  nickname: string
  avatarImage: string
  exchangeAddedDate: string
  stickersOffered: string // comma-separated identifiers
  stickersWanted: string // comma-separated identifiers
}

type CurrentExchangesResponse = ApiEnvelope<CurrentExchange[]>

// Removed unused CompleteExchangePayload interface

interface CompleteExchangeData {
  message: string
}

type CompleteExchangeResponse = ApiEnvelope<CompleteExchangeData>

interface CancelExchangeData {
  message: string
}

type CancelExchangeResponse = ApiEnvelope<CancelExchangeData>

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

  async openPack(customerId: string, packTypeId: number = 1): Promise<CustomerStickersResponse> {
    const response = await fetch(`${API_BASE_URL}/OpenPack`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify({
        Customerid: customerId,
        PackTypeId: packTypeId
      })
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    return await response.json()
  },

  async getFriends(customerId: string): Promise<FriendsResponse> {
    const response = await fetch(`${API_BASE_URL}/Friends`, {
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

  async sendGift(customerId: string, customerFriendId: number, stickers: SendGiftStickerItem[]): Promise<SendGiftResponse> {
    const response = await fetch(`${API_BASE_URL}/SendGift`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify({
        customerId: customerId,
        customerFriendId: customerFriendId,
        stickers: stickers
      })
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    return await response.json()
  },

  async tryExchange(customerId: number, offer: ExchangeOfferItem[], wanted: ExchangeWantedItem[]): Promise<TryExchangeResponse> {
    const response = await fetch(`${API_BASE_URL}/TryExchange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify({
        customerId: customerId,
        offer: offer,
        wanted: wanted
      })
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    return await response.json()
  },

  async getCurrentExchanges(customerId: string): Promise<CurrentExchangesResponse> {
    const response = await fetch(`${API_BASE_URL}/CurrentExchanges`, {
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

  async completeExchange(customerIdCompleted: number, exchangeId: number): Promise<CompleteExchangeResponse> {
    const response = await fetch(`${API_BASE_URL}/CompleteExchange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify({
        CustomerIdCompleted: customerIdCompleted,
        ExchangeId: exchangeId
      })
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    return await response.json()
  },

  async cancelExchange(customerId: string, exchangeId: number): Promise<CancelExchangeResponse> {
    const response = await fetch(`${API_BASE_URL}/CancelExchange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify({
        Customerid: customerId,
        ExchangeId: exchangeId
      })
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    return await response.json()
  },

  async getCustomerStickersCustom(customerId: number): Promise<CustomerStickersResponse> {
    const response = await fetch(`${API_BASE_URL}/CustomerStickersCustom`, {
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