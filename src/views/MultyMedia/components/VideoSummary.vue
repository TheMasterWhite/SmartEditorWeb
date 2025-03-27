<template>
  <div>
    <el-upload class="upload-demo" action="/uploadVideo" :before-upload="handleUpload" :auto-upload="false">
      <template v-slot:trigger>
        <el-button type="primary">选择视频</el-button>
      </template>
    </el-upload>

    <el-button type="primary" @click="summarizeVideo">解析视频</el-button>

    <el-divider />
  </div>
  <el-input v-model="videoSummary" placeholder="视频内容总结" style="height: 50%" />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"

export default defineComponent({
  data() {
    return {
      videoSummary: ref<string>("") // 使用ref来定义响应式数据
    }
  },
  methods: {
    handleUpload(file: File) {
      // 添加类型注解
      // 处理上传的视频文件
    },
    summarizeVideo() {
      // 发送请求，获取视频内容摘要，这里模拟生成一个示例内容
      this.videoSummary = "这是视频内容的摘要信息。"
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
