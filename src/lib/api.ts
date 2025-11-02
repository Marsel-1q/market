const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? ''
const AUTH_TOKEN_STORAGE_KEY = 'quant_auth_token'

type HttpMethod = 'GET' | 'POST'

type ApiOptions = Omit<RequestInit, 'body' | 'method' | 'headers'> & {
  method?: HttpMethod
  body?: BodyInit | Record<string, unknown>
  headers?: HeadersInit
}

interface ApiError {
  message: string
  details?: unknown
  status?: number
}

const getAuthToken = () => (typeof window !== 'undefined' ? window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) : null)

const buildHeaders = (customHeaders?: HeadersInit): HeadersInit => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  const token = getAuthToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  if (customHeaders) {
    return { ...headers, ...customHeaders }
  }

  return headers
}

async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('API base URL is not configured (missing VITE_API_BASE_URL)')
  }

  const { method = 'GET', body, headers, ...rest } = options

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: buildHeaders(headers),
    body: body && typeof body === 'object' && !(body instanceof FormData) ? JSON.stringify(body) : (body as BodyInit | null | undefined),
    ...rest,
  })

  const contentType = response.headers.get('content-type')
  const isJson = contentType?.includes('application/json')

  if (!response.ok) {
    let errorBody: ApiError = { message: response.statusText }

    if (isJson) {
      const data = (await response.json()) as ApiError
      errorBody = { ...errorBody, ...data }
    }

    errorBody.status = response.status
    const error = new Error(errorBody.message)
    Object.assign(error, errorBody)
    throw error
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (isJson ? response.json() : response.text()) as Promise<T>
}

export interface DepositResponse {
  depositId: string
  code: string
  amount: number
  tonLink: string
  qrCode: string
  expiresAt?: string
}

export const createDeposit = (amount: number) =>
  apiRequest<DepositResponse>('/api/deposit/create', {
    method: 'POST',
    body: { amount },
  })

export interface WithdrawalResponse {
  withdrawalId: string
  status: string
  amount: number
}

export const requestWithdrawal = (params: { amount: number; recipientAddress: string }) =>
  apiRequest<WithdrawalResponse>('/api/withdraw/request', {
    method: 'POST',
    body: params,
  })

export interface ProfileResponse {
  tonAddress: string
  balance: number
  reservedBalance: number
  network: string
  username?: string
  telegramId?: string
}

export const fetchProfile = () => apiRequest<ProfileResponse>('/api/profile/balance')

export interface TransactionEntry {
  _id: string
  type: string
  amount: number
  status: string
  itemId?: string
  txHash?: string
  createdAt: string
}

export const fetchTransactions = (limit = 20) =>
  apiRequest<{ transactions: TransactionEntry[] }>(`/api/transactions?limit=${limit}`)

export const authStorage = {
  getToken: getAuthToken,
  setToken: (token: string | null) => {
    if (typeof window === 'undefined') return
    if (token) {
      window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token)
    } else {
      window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
    }
  },
}
