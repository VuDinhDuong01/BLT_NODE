
export interface GenerateType<T> {
  message: string
  data: T
  total_records?: number
  limit?: number
  current_page?: number
  total_page?: number
}
