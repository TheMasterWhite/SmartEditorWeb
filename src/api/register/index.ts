import { request } from "@/utils/service"
import type * as Register from "./types/register"

/** 获取注册验证码 */
export function getRegisterCodeApi() {
  return request<Register.RegisterResponseData>({
    url: "register/code",
    method: "get"
  })
}

/** 注册并返回 Token */
export function registerApi(data: Register.RegisterRequestData) {
  return request<Register.RegisterResponseData>({
    url: "users/register",
    method: "post",
    data
  })
}

/** 获取用户详情 */
export function getUserApi() {
  return request<Register.UserResponseData>({
    url: "users",
    method: "get"
  })
}
