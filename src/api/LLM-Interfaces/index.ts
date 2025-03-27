import axios from "axios"

const apiClient = axios.create({
  baseURL: "http://8.148.25.61:8888//" // 替换为你的域名和端口
})

const token = localStorage.getItem("myToken")
apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`
// 定义接口返回类型
export interface ResponseType {
  statusCode: number
  requestTime: string
  response: any
}

// 定义请求参数类型
export interface CommonParams {
  content: string
  scene?: string
}

// 定义翻译接口参数类型
export interface TranslateParams extends CommonParams {
  language?: string
}

// 定义机器人对话接口参数类型
export interface ChatBotParams extends CommonParams {
  userId?: string
  fileName?: Array<string>
}

export interface formParams {
  content: string
  template: string
  materialFiles: Array<string>
}

// 大模型接口封装
const LLMInterfaces = {
  // 翻译
  translate(params: TranslateParams): Promise<ResponseType> {
    return apiClient.post("/LLMInterface/Translate", params)
  },
  // 翻译流
  translateStream(params: TranslateParams): Promise<ResponseType> {
    return apiClient.post("/LLMInterface/TranslateStream", params)
  },
  // 总结
  summary(params: CommonParams): Promise<ResponseType> {
    return apiClient.post("/LLMInterface/Summary", params)
  },
  // 总结流
  summaryStream(params: CommonParams): Promise<ResponseType> {
    return apiClient.post("/LLMInterface/SummaryStream", params)
  },
  // 润色
  polish(params: CommonParams): Promise<ResponseType> {
    return apiClient.post("/LLMInterface/Polish", params)
  },
  // 润色流
  polishStream(params: CommonParams): Promise<ResponseType> {
    return apiClient.post("/LLMInterface/PolishStream", params)
  },
  // 纠错
  correct(params: CommonParams): Promise<ResponseType> {
    return apiClient.post("/LLMInterface/Correct", params)
  },
  // 纠错流
  correctStream(params: CommonParams): Promise<ResponseType> {
    return apiClient.post("/LLMInterface/CorrectStream", params)
  },
  // 机器人对话
  chatBot(params: ChatBotParams): Promise<ResponseType> {
    return apiClient.post("/LLMInterface/ChatBot", params)
  },
  // 机器人对话流
  chatBotStream(params: ChatBotParams): Promise<ResponseType> {
    return apiClient.post("/LLMInterface/ChatBotStream", params)
  },
  // 知识库检查文本内容
  check(params: ChatBotParams): Promise<ResponseType> {
    return apiClient.post("/LLMInterface/Check", params)
  },
  // 知识库检查文本内容流
  checkStream(params: ChatBotParams): Promise<ResponseType> {
    return apiClient.post("/LLMInterface/CheckStream", params)
  },
  textGen(params: formParams): Promise<ResponseType> {
    return apiClient.post("/LLMInterface/TextGen", params)
  },
  mainPageUtils(params: { content: string }): Promise<ResponseType> {
    return apiClient.post("/LLMInterface/AIWriting", params)
  },
  PPTCatalog(params: { content: string; materialFiles: Array<string> }): Promise<ResponseType> {
    return apiClient.post("/LLMInterface/PPTCatalog", params)
  },
  PPTGenerate(params: { content: string; materialFiles: Array<string>; catalog: any }): Promise<ResponseType> {
    return apiClient.post("/LLMInterface/PPTGenerate", params)
  }
}

export default LLMInterfaces
