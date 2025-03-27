import axios from "axios"

const apiClient = axios.create({
  baseURL: "http://8.148.25.61:8888//" // 替换为你的域名和端口
})
const token = localStorage.getItem("myToken")
apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`

// 定义接口返回类型
interface ResponseType {
  statusCode: number
  requestTime: string
  response: any
}

// 定义文件名参数类型
interface FileNameParams {
  uuid: string | string[]
}

interface FileList {
  description: string
  name: string
  time: string
}

// 文件处理接口封装
const FileInterfaces = {
  // 上传文件
  uploadFile(file: File): Promise<ResponseType> {
    const formData = new FormData()
    formData.append("file", file)
    return apiClient.post("/Service/UploadFile", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
  },
  // 下载文件
  async downloadFile(uuid: string): Promise<void> {
    try {
      const response = await apiClient.get(`/Service/DownloadFile?uuid=${uuid}`, {
        responseType: "blob"
      })

      // 创建Blob对象
      const blob = new Blob([response.data], { type: response.data.type })

      // 创建一个链接元素用于下载
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = downloadUrl
      a.download = "downloaded_file" // 指定下载文件名，可以根据实际情况修改
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(downloadUrl) // 清理URL对象
    } catch (error) {
      console.error("下载文件出错:", error)
    }
  },

  // 删除文件
  deleteFile(params: FileNameParams): Promise<ResponseType> {
    return apiClient.post("/Service/DeleteFile", params)
  },
  // 联网检查
  checkFile(params: FileNameParams): Promise<ResponseType> {
    return apiClient.post("/Service/CheckFile", params)
  },
  // 读取文件
  readFile(params: FileNameParams): Promise<ResponseType> {
    return apiClient.post("/Service/ReadFile", params)
  },
  // 保存文本
  saveFile(params: { content: string }): Promise<ResponseType> {
    return apiClient.post("/Service/Save", params)
  },
  getFile(): Promise<FileList> {
    return apiClient.get("/Service/GetFileInfo")
  },
  ReadFile(params: { uuid: string }): Promise<ResponseType> {
    return apiClient.post("/Service/ReadFile", params)
  }
}

export default FileInterfaces
function downloadFile(uuid: any, string: any) {
  throw new Error("Function not implemented.")
}
