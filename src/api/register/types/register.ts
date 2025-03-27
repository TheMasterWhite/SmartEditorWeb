export interface RegisterRequestData {
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
  /** 确认密码 */
  ConfirmPassword: string
  /** 邮箱 */
  email: string
  /** 验证码 */
  code: string
}

export type RegisterResponseData = ApiResponseData<{ token: string }>

export type UserResponseData = ApiResponseData<{ username: string; email: string }>
