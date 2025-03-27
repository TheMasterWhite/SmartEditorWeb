import axios from "axios"

const apiClient = axios.create({
  baseURL: "http://8.148.25.61:8888//" // 替换为你的域名和端口
})

export interface LoginRequestData {
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
}

/**
 * 登录方法
 * @param {LoginRequestData} data 登录表单数据
 * @returns {Promise<boolean>} 登录成功或失败的判断值
 */
export const login = async (data: LoginRequestData): Promise<boolean> => {
  try {
    // 发起登录请求
    const response = await apiClient.post("/Service/Login", data)
    // 检查响应状态码是否为200
    if (response.data.statusCode == 1) {
      // 获取Token
      const token = response.data.token

      // 储存Token
      console.log(token)
      localStorage.setItem("myToken", response.data.token)

      // 登录成功，返回true
      return true
    } else {
      // 登录失败，返回false
      return false
    }
  } catch (error) {
    // 登录失败，返回false
    return false
  }
}
