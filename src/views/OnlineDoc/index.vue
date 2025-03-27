<template>
  <div class="tools-page">
    <h1>在线文档</h1>
    <el-row :gutter="20">
      <!-- 修改为每行一个按钮 -->
      <el-col
        v-for="(tool, index) in tools"
        :key="index"
        :span="24"
        v-motion
        :initial="{ opacity: 0, x: -100 }"
        :enter="{ opacity: 1, x: 0, scale: 1 }"
        :delay="index * 10"
      >
        <div class="tool-button-container">
          <ToolButton
            :tool="tool"
            @click="handleToolButtonClick(tool)"
            @delete="deleteToolByName"
            @editClick="toEdit(tool)"
            @downloadClick="downloadFile(tool)"
            @checkClick="checkFile(tool)"
          />
        </div>
      </el-col>
    </el-row>
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="50%" height="50%">
      <div class="dialog-content">
        <textarea v-model="inputText" placeholder="请输入内容" autocomplete="off" class="large-input" />
      </div>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { ref } from "vue"
import ToolButton from "./components/ToolButton.vue"
import { ElRow, ElCol } from "element-plus"
import * as file_Interfaces from "@/api/file-interfaces/index"
import * as LLMInterfaces from "@/api/LLM-Interfaces"

export default {
  name: "ToolsPage",
  components: {
    ToolButton,
    ElRow,
    ElCol
  },
  setup() {
    interface Tool {
      fileName: string
      description: string
      saveTime: string
      uuid: string
    }
    const dialogVisible = ref(false)
    const inputText = ref("")
    const dialogTitle = ref("")
    async function fetchData() {
      try {
        const result = await file_Interfaces.default.getFile()
        return result
      } catch (error) {
        // 处理可能出现的错误
        console.error("An error occurred:", error)
      }
    }
    const tools = ref<Array<Tool>>([]) // 初始化工具数组

    fetchData()
      .then((data) => {
        // @ts-ignore
        tools.value = data.data.response // 当 fetchData 成功解析时，更新 tools
        console.log(tools.value)
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error)
      })

    // const tools = ref<Array<Tool>>([
    //   // 修改为数组，每行一个工具
    //   {
    //     name: "新建文档1",
    //     description: "这是新建文档1的描述",
    //     time: "文档一份"
    //   },
    //   {
    //     name: "新建文档2",
    //     description: "这是新建文档2的描述",
    //     time: "文档一份"
    //   },
    //   {
    //     name: "新建文档3",
    //     description: "这是新建文档3的描述",
    //     time: "文档一份"
    //   },
    //   {
    //     name: "新建文档4",
    //     description: "这是新建文档4的描述",
    //     time: "文档一份"
    //   },
    //   {
    //     name: "新建文档5",
    //     description: "这是工具5的描述",
    //     time: "文档一份"
    //   },
    //   {
    //     name: "新建文档6",
    //     description: "这是新建文档6的描述",
    //     time: "文档一份"
    //   },
    //   {
    //     name: "新建文档7",
    //     description: "这是新建文档7的描述",
    //     time: "文档一份"
    //   },
    //   {
    //     name: "新建文档8",
    //     description: "这是新建文档8的描述",
    //     time: "文档一份"
    //   }
    // ])

    const handleToolButtonClick = (tool: Tool) => {
      console.log(`Tool clicked: ${tool.fileName}`)
    }
    const deleteToolByName = (ownTool: Tool) => {
      const index = tools.value.findIndex((tool: Tool) => tool.fileName === ownTool.fileName)
      console.log(index)
      if (index !== -1) {
        tools.value.splice(index, 1)
      }
      file_Interfaces.default.deleteFile({ uuid: ownTool.uuid })
    }
    const toEdit = async (tool: Tool) => {
      dialogTitle.value = "浏览素材"
      inputText.value = ""
      dialogVisible.value = true
      const param = {
        uuid: tool.uuid
      }
      const result = await file_Interfaces.default.ReadFile(param)
      // @ts-ignore
      inputText.value = result.data.response
    }

    const downloadFile = (tool: Tool) => {
      //file_Interfaces.default.downloadFileFromServer(tool.name)
      // @ts-ignore
      file_Interfaces.default.downloadFile(tool.uuid)
    }
    const checkFile = async (tool: Tool) => {
      dialogTitle.value = "知识库检查"
      inputText.value = ""
      dialogVisible.value = true
      const param = {
        content: inputText,
        uuid: tool.uuid
      }
      const result = await file_Interfaces.default.checkFile(param)
      // @ts-ignore
      inputText.value = result.data.response
    }

    return {
      tools,
      handleToolButtonClick,
      deleteToolByName,
      toEdit,
      downloadFile,
      checkFile,
      dialogTitle,
      dialogVisible,
      inputText
    }
  }
}
</script>

<style scoped>
.tools-page {
  display: flex; /* 使用flex布局 */
  flex-direction: column; /* 垂直方向排列子元素 */
  align-items: center; /* 水平居中子元素 */
  justify-content: center; /* 垂直居中子元素 */
  min-height: 100vh; /* 最小高度设为视口高度，确保即使内容少也能居中 */
  padding: 55px; /* 页面内边距 */
}

/* ... 其他样式保持不变 ... */

.tool-button-container {
  width: 100%; /* 使按钮容器宽度填充整个列 */
  padding: 10px; /* 按钮容器内边距 */
  box-sizing: border-box; /* 确保边框和内边距包含在宽度和高度内 */
}

/* ... 其他样式保持不变 ... */
.result-container {
  padding: 10px;
  height: 100%;
  overflow: auto;
  box-shadow: 0 0 0 1px rgb(43, 41, 152); /* 随背景反色的框 */
}
.large-input {
  width: 100%;
  height: 50vh;
  box-sizing: border-box;
}
</style>
