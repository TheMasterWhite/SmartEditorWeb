<!-- UserInfo.vue -->
<template>
  <div class="user-info">
    <el-form :model="userInfo" label-width="120px">
      <el-form-item label="名称">
        <el-input v-model="userInfo.name" :disabled="!isEditingName" placeholder="请输入名称" />
        <el-button v-if="!isEditingName" type="text" @click="isEditingName = true">编辑</el-button>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="userInfo.password" :disabled="!isEditingPassword" show-password placeholder="请输入密码" />
        <el-button v-if="!isEditingPassword" type="text" @click="isEditingPassword = true">编辑</el-button>
      </el-form-item>
      <el-form-item label="余额">
        <el-input v-model="userInfo.balance" :disabled="true" placeholder="请输入余额" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateUserInfo">更新信息</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { ref } from "vue"

export default {
  name: "UserInfo",
  setup() {
    // 定义类型注解
    const userInfo = ref<{
      name: string
      password: string
      balance: number
    }>({
      name: "Admin",
      password: "123456",
      balance: 1000
    })

    const isEditingName = ref<boolean>(false)
    const isEditingPassword = ref<boolean>(false)

    const updateUserInfo = () => {
      // 在更新信息时，将编辑状态重置为false，并处理更新逻辑
      isEditingName.value = false
      isEditingPassword.value = false

      // 模拟发送更新请求
      console.log("Updated User Info:", userInfo.value)
    }

    return {
      userInfo,
      isEditingName,
      isEditingPassword,
      updateUserInfo
    }
  }
}
</script>

<style scoped>
.user-info {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ebebeb;
  border-radius: 5px;
}
</style>
