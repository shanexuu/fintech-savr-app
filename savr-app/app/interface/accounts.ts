export interface RootObject {
  success: boolean
  items: Accounts[]
  cursor: Cursor
}

interface Cursor {
  next: string
}

export interface Accounts {
  _id: string
  _account: string
  _user: string
  _connection: string
  created_at: string
  updated_at: string
  date: string
  description: string
  amount: number
  balance: number
  type: string
  hash: string
  meta: Meta
  merchant?: Merchant
  category?: Category
}

export interface Category {
  _id: string
  name: string
  groups: Groups
}

interface Groups {
  personal_finance: Personalfinance
}

interface Personalfinance {
  _id: string
  name: string
}

export interface Merchant {
  _id: string
  name: string
  website?: string
}

interface Meta {
  code?: string
  reference?: string
  card_suffix?: string
  logo?: string
  other_account?: string
  particulars?: string
}
