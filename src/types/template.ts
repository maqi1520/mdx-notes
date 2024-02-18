export type Result = Daum[]

export interface Daum {
  id: string
  img: string
  name: string
  status: number
  docId: string
  creator: string
  tags: string[]
  description: string
}
