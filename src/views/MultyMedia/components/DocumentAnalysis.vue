<template>
  <div>
    <el-upload class="upload-demo" action="/uploadFile" :before-upload="handleUpload" :auto-upload="false">
      <template v-slot:trigger>
        <el-button type="primary">选择文件</el-button>
      </template>
    </el-upload>

    <el-button type="primary" @click="parseDocument">解析文档</el-button>

    <el-divider />

    <el-button type="success" @click="downloadDocument" v-if="docContent">下载文档</el-button>

    <a :href="downloadUrl" download="parsed_document.docx" v-if="downloadUrl"> 点击这里下载解析后的文档 </a>
  </div>
  <el-input v-model="docContent" placeholder="内容总结" style="height: 50%" />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"

export default defineComponent({
  data() {
    return {
      docContent: ref<string>(""), // 使用ref来定义响应式数据
      downloadUrl: ref<string>("") // 使用ref来定义响应式数据
    }
  },
  methods: {
    handleUpload(file: File) {
      // 添加类型注解
      // 处理上传的文件，这里可以根据具体情况处理PDF或照片上传逻辑
    },
    parseDocument() {
      // 发送解析请求，获取doc文档内容，这里模拟生成一个示例内容
      this.docContent = "这是解析后的文档内容。"
      // 这里需要根据实际情况生成下载链接
      const documentContent = "文档内容" // 假设这是要下载的文档内容
      this.downloadUrl = `data:application/msword;base64,${btoa(documentContent)}`
    },
    downloadDocument() {
      // 实现文档下载逻辑
      const link = document.createElement("a")
      link.href = this.downloadUrl
      link.download = "文档下载.doc" // 设置下载的文件名
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
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
