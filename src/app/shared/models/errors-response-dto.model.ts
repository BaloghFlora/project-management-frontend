export interface ErrorsResponseDTO {
  timestamp: string,
  code: string,
  message: string,
  details: {
    [key: string]: string
  }
}
