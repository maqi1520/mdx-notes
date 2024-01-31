export interface Result {
  data: Daum[]
  hasmore: boolean
}

export interface Daum {
  _id: string
  img: string
  name: string
  status: number
  docId: string
  createTime: number
  creator: string
  tags: string[]
  desc: string
}
