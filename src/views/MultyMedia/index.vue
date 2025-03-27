<template>
  <div class="father">
    <div class="upload-container">
      <div type="primary" class="upload_btn" @click="handleClick" plain>
        <span style="font-size: 24px">点击上传文件</span><br /><br />
        <span style="font-size: 12px"
          >格式支持：mp3、mp4、wav、pcm、m4a、amr、pdf、ppt、pptx、jpg、jpeg、png、txt、doc、docx;
        </span>
      </div>
      <input ref="fileInput" type="file" multiple style="display: none" @change="handleFileChange" />
      <div class="file-list">
        <el-card class="file-item" v-for="(file, index) in fileList" :key="index">
          <template #header>
            <div class="card-header">
              <span>{{ file.name }}</span>
              <el-icon v-if="file.status === 'uploading'" class="uploading-icon">
                <Loading />
              </el-icon>
              <el-icon v-else-if="file.status === 'success'" class="success-icon">
                <CircleCheck />
              </el-icon>
              <el-icon v-else-if="file.status === 'error'" class="error-icon">
                <CircleClose />
              </el-icon>
            </div>
          </template>
        </el-card>
      </div>
    </div>
  </div>
  <!-- <div v-html="htmlContent" /> -->
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { ElButton, ElCard, ElIcon } from "element-plus"
import { Loading, CircleCheck, CircleClose } from "@element-plus/icons-vue"
import * as file_Interfaces from "@/api/file-interfaces/index"
// import htmlContent from "./components/uploadButton.html"

interface FileItem {
  name: string
  status: "uploading" | "success" | "error"
}

const fileInput = ref<HTMLInputElement | null>(null)
const fileList = ref<FileItem[]>([])

const handleClick = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files ?? [])
  files.forEach((file) => {
    fileList.value.push({
      name: file.name,
      status: "uploading"
    })
  })

  // 这里可以添加上传文件的逻辑，例如使用axios发送请求
  // 模拟上传过程
  for (const file of files) {
    const index = fileList.value.findIndex((f) => f.name === file.name)
    if (index !== -1) {
      try {
        const response = await file_Interfaces.default.uploadFile(file)
        // @ts-ignore
        if (response.data.statusCode) {
          fileList.value[index].status = "success"
        } else {
          fileList.value[index].status = "error"
        }
      } catch (error) {
        fileList.value[index].status = "error"
      }
    }
  }
}
</script>

<style scoped>
.father {
  flex-grow: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.upload-container {
  display: flex;
  height: 100vh;
  width: 70vh;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.upload_btn {
  display: block; /* 将按钮设置为块级元素，使其宽度填充容器 */
  width: 100%; /* 使按钮宽度填充容器 */
  transition:
    transform 0.3s ease,
    background-color 0.3s ease;
  cursor: pointer;
  border: 1px solid #ccc; /* 添加边框 */
  padding: 10px; /* 添加内边距 */
  box-sizing: border-box; /* 确保边框和内边距包含在宽度和高度内 */
  display: inline-block;
  transition:
    transform 0.3s ease,
    background-color 0.3s ease;
  cursor: pointer;
  white-space: normal;
  word-wrap: break-word;
  width: 70%;
  height: 30%;
  background: white;
  color: black;
  padding: 30px; /* 增加内边距，使按钮看起来不那么拥挤 */
  text-align: center;
  align-content: center;
}
.upload_btn:hover {
  transform: scale(1.1);
  border-color: #409eff; /* 点击时改变边框颜色 */
}

.upload_btn:active {
  transform: scale(0.9);
  background-color: #f0f0f0; /* Example color for the click effect */
  transition:
    transform 0.1s ease,
    background-color 0.1s ease;
  border-color: #409eff; /* 点击时改变边框颜色 */
}

.file-list {
  margin-top: 20px;
  width: 70%;
}

.file-item {
  margin-bottom: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.uploading-icon,
.success-icon,
.error-icon {
  font-size: 20px;
}

.uploading-icon {
  color: #409eff;
}

.success-icon {
  color: #67c23a;
}

.error-icon {
  color: #f56c6c;
}
</style>
