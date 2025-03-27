<script lang="ts" setup>
import { reactive, ref } from "vue"
import { useRouter } from "vue-router"
import { useUserStore } from "@/store/modules/user"
import { type FormInstance, type FormRules } from "element-plus"
import { User, Lock, Key, Picture, Loading } from "@element-plus/icons-vue"
import { getRegisterCodeApi } from "@/api/register" // 假设的注册API
import { type RegisterRequestData } from "@/api/register/types/register" // 假设的注册请求类型
import ThemeSwitch from "@/components/ThemeSwitch/index.vue"
import Owl from "./components/Owl.vue"
import { useFocus } from "./hooks/useFocus"

const router = useRouter()
const { isFocus, handleBlur, handleFocus } = useFocus()

const registerFormRef = ref<FormInstance | null>(null)

const loading = ref(false)
const codeUrl = ref("")

const registerFormData: RegisterRequestData = reactive({
  username: "",
  password: "",
  ConfirmPassword: "", // 添加确认密码字段
  code: "",
  email: ""
})

const registerFormRules: FormRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 8, max: 16, message: "长度在 8 到 16 个字符", trigger: "blur" }
  ],
  confirmPassword: [
    { required: true, message: "请再次输入密码", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value !== registerFormData.password) {
          callback(new Error("两次输入密码不一致!"))
        } else {
          callback()
        }
      },
      trigger: "blur"
    }
  ],
  code: [{ required: true, message: "请输入验证码", trigger: "blur" }]
}

const handleRegister = () => {
  registerFormRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      loading.value = true
      useUserStore()
      // .register(registerFormData) // 假设的注册方法
      // .then(() => {
      //   router.push({ path: "/" })
      // })
      // .catch(() => {
      //   createCode()
      // })
      // .finally(() => {
      //   loading.value = false
      // })
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}
const goToLogin = () => {
  router.push({ path: "/login" })
  //console.log("Button clicked!")
}

const createCode = () => {
  registerFormData.code = ""
  codeUrl.value = ""
  getRegisterCodeApi().then((res) => {
    //codeUrl.value = res.data
  })
}

createCode()
</script>

<template>
  <div class="register-container">
    <ThemeSwitch class="theme-switch" />
    <Owl :close-eyes="isFocus" />
    <div class="register-card">
      <div class="title">
        <img src="./logo-text-2.png" style="width: 80%; height: 80%" />
      </div>
      <div class="content">
        <el-form
          ref="registerFormRef"
          :model="registerFormData"
          :rules="registerFormRules"
          @keyup.enter="handleRegister"
        >
          <el-form-item prop="username">
            <el-input
              v-model.trim="registerFormData.username"
              placeholder="用户名"
              type="text"
              tabindex="1"
              :prefix-icon="User"
              size="large"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model.trim="registerFormData.password"
              placeholder="密码"
              type="password"
              tabindex="2"
              :prefix-icon="Lock"
              size="large"
              show-password
              @blur="handleBlur"
              @focus="handleFocus"
            />
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input
              v-model.trim="registerFormData.ConfirmPassword"
              placeholder="确认密码"
              type="password"
              tabindex="3"
              :prefix-icon="Lock"
              size="large"
              show-password
              @blur="handleBlur"
              @focus="handleFocus"
            />
          </el-form-item>
          <el-form-item prop="code">
            <el-input
              v-model.trim="registerFormData.code"
              placeholder="验证码"
              type="text"
              tabindex="5"
              :prefix-icon="Key"
              maxlength="7"
              size="large"
            >
              <template #append>
                <el-image :src="codeUrl" @click="createCode" draggable="false">
                  <template #placeholder>
                    <el-icon>
                      <Picture />
                    </el-icon>
                  </template>
                  <template #error>
                    <el-icon>
                      <Loading />
                    </el-icon>
                  </template>
                </el-image>
              </template>
            </el-input>
          </el-form-item>
          <el-button :loading="loading" type="primary" size="large" @click.prevent="handleRegister">注 册</el-button>
        </el-form>
        <!-- 登录按钮 -->
        <el-button type="text" size="default" @click="goToLogin">注册完毕？立即登录</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.register-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100%;
  .theme-switch {
    position: fixed;
    top: 5%;
    right: 5%;
    cursor: pointer;
  }
  .register-card {
    width: 480px;
    max-width: 90%;
    border-radius: 20px;
    box-shadow: 0 0 10px #dcdfe6;
    background-color: var(--el-bg-color);
    overflow: hidden;
    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 150px;
      img {
        height: 100%;
      }
    }
    .content {
      padding: 20px 50px 50px 50px;
      :deep(.el-input-group__append) {
        padding: 0;
        overflow: hidden;
        .el-image {
          width: 100px;
          height: 40px;
          border-left: 0px;
          user-select: none;
          cursor: pointer;
          text-align: center;
        }
      }
      .el-button {
        width: 100%;
        margin-top: 10px;
      }
    }
  }
}
</style>
