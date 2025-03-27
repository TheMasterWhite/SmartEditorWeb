<template>
  <div>
    <el-upload class="upload-demo" action="/uploadAudio" :before-upload="handleUpload" :auto-upload="false">
      <template v-slot:trigger>
        <el-button type="primary">选择音频</el-button>
      </template>
    </el-upload>

    <el-button type="primary" @click="extractAudio">解析音频</el-button>

    <el-divider />
  </div>
  <el-input v-model="audioText" placeholder="音频内容提取" style="height: 50%" />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"

export default defineComponent({
  data() {
    return {
      audioText: ref<string>("") // 使用ref来定义响应式数据
    }
  },
  methods: {
    handleUpload(file: File) {
      // 添加类型注解
      // 处理上传的音频文件
    },
    extractAudio() {
      // 发送请求，获取音频内容文本，这里模拟生成一个示例内容
      this.audioText = "这是音频内容的提取文本。"
    }
  }
})
</script>

<style scoped>
.upload-demo {
  display: inline-block;
  margin-right: 15px;
}
</style>
