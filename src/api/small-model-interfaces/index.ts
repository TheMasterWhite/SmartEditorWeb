import axios from "axios"

// 定义接口返回类型
interface ResponseType {
  statusCode: number
  requestTime: string
  response: any
}

// 定义 OCR 接口参数类型
interface OCRParams {
  fileName: string[]
}

// 定义语音转文字接口参数类型
interface STTParams {
  fileData: {
    name: string
    language: string
  }[]
}

// 小模型接口封装
const SmallModelInterfaces = {
  // OCR
  ocr(params: OCRParams): Promise<ResponseType> {
    return axios.post("/SModelInterface/OCR", params)
  },
  // 语音转文字
  stt(params: STTParams): Promise<ResponseType> {
    return axios.post("/SModelInterface/STT", params)
  }
}

export default SmallModelInterfaces
