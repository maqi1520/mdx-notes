export type Result = Daum[]

export interface Daum {
  id: string
  img: string
  name: string
  status: number
  doc_id: string
  creator: string
  tags: string[]
  desc: string
}
