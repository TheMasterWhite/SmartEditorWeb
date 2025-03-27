<!-- ToolsPage.vue -->
<template>
  <div class="tools-page">
    <h1>工具箱</h1>
    <el-row :gutter="20">
      <!-- 设置行间距 -->
      <el-col
        v-for="(toolRow, rowIndex) in tools"
        :key="rowIndex"
        :span="8"
        v-motion
        :initial="{ opacity: 0, x: -100 }"
        :enter="{ opacity: 1, x: 0, scale: 1 }"
        :delay="rowIndex * 10"
      >
        <div class="tool-button-container" v-for="(tool, colIndex) in toolRow" :key="colIndex">
          <ToolButton :tool="tool" @click="handleToolButtonClick(tool)" />
        </div>
      </el-col>
    </el-row>
  </div>
  <el-dialog :title="dialogTitle" v-model="dialogVisible" width="70%" :before-close="handleClose">
    <span>{{ description }}</span>
    <div class="dialog-content">
      <textarea v-model="inputText" placeholder="请输入内容" autocomplete="off" class="large-input" />
      <el-main style="padding: 10px">
        <el-container style="height: 100%">
          <el-main style="overflow: hidden">
            <div class="result-container">
              <div v-html="result" />
            </div>
            <el-checkbox v-model="selectedOptions" v-for="option in options" :key="option" :label="option">
              {{ option }}
            </el-checkbox>
          </el-main>
        </el-container>
      </el-main>
    </div>

    <template v-slot:footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="generate">生 成</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogConfirm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { ref } from "vue"
import ToolButton from "./components/ToolButton.vue"
import { ElRow, ElCol, ElMessageBox } from "element-plus"
import * as LLM_Interfaces from "@/api/LLM-Interfaces/index"
import * as file_Interfaces from "@/api/file-interfaces/index"

export default {
  name: "ToolsPage",
  components: {
    ToolButton,
    ElRow,
    ElCol
  },
  setup() {
    // 定义工具类型
    interface Tool {
      name: string
      iconSize?: string // 添加可选的iconSize属性
      description: string
      sentence: string
      data?: string[]
      icons?: string[]
      onClick?: any
    }
    const dialogVisible = ref(false)
    const result = ref("")
    const description = ref("")
    const inputText = ref("")
    const dialogTitle = ref("")
    const options = ref([])
    const selectedOptions = ref([])
    async function fetchData() {
      try {
        const result = await file_Interfaces.default.getFile()
        return result
      } catch (error) {
        // 处理可能出现的错误
        console.error("An error occurred:", error)
      }
    }
    const dictionary = ref({})
    fetchData().then((data) => {
      // @ts-ignore
      const tools = data.data.response // 当 fetchData 成功解析时，更新 tools
      // eslint-disable-next-line no-global-assign
      //@ts-ignore
      options.value = tools.map((item) => item.fileName)
      // @ts-ignore
      dictionary.value = tools.reduce((acc, tools) => ({ ...acc, [tools.fileName]: tools.uuid }), {})
    })

    // 使用类型注解
    const tools = ref<Array<Array<Tool>>>([
      [
        {
          name: "邀请函",
          description: "通知特定人士参加活动、聚会或会议，说明时间、地点及其他必要信息。",
          sentence: "写一段邀请函",
          data: ["邀请函", "写一段邀请函", "./tool"]
        },
        {
          name: "通知",
          description: "发布重要信息或变动，确保相关人士得到及时更新。",
          sentence: "写一段通知",
          icons: ["el-icon-s-cooperation", "el-icon-error", "el-icon-info"]
        },
        {
          name: "视频文案",
          description: "为视频内容创作配套的文字描述，吸引观众并传达视频主旨。",
          sentence: "写一段视频文案",
          icons: ["el-icon-s-platform", "el-icon-question", "el-icon-s-opportunity"]
        }
      ],
      [
        {
          name: "观后感",
          description: "表达观看电影、电视剧或其他演出后的感受和看法。",
          sentence: "写一段观后感",
          icons: ["el-icon-s-tools", "el-icon-success", "el-icon-warning"]
        },
        {
          name: "藏头诗",
          description: "一种诗歌形式，每句或每联的第一个字连起来可以形成一个词语或短语。",
          sentence: "写一首藏头诗",
          icons: ["el-icon-s-cooperation", "el-icon-error", "el-icon-info"]
        },
        {
          name: "演讲稿",
          description: "为演讲活动准备的文稿，包含演讲的主要内容和结构。",
          sentence: "写一段演讲稿",
          icons: ["el-icon-s-platform", "el-icon-question", "el-icon-s-opportunity"]
        }
      ],
      [
        {
          name: "旅行攻略",
          description: "提供旅行目的地、路线、住宿、餐饮等信息和建议。",
          sentence: "写一份旅行攻略",
          icons: ["el-icon-s-tools", "el-icon-success", "el-icon-warning"]
        },
        {
          name: "心得体会",
          description: "分享个人在学习、工作或生活中的感悟和体验。",
          sentence: "写一份心得体会",
          icons: ["el-icon-s-cooperation", "el-icon-error", "el-icon-info"]
        },
        {
          name: "会议纪要",
          description: "记录会议讨论的要点、决定和待办事项。",
          sentence: "写一份会议纪要",
          icons: ["el-icon-s-platform", "el-icon-question", "el-icon-s-opportunity"]
        }
      ],
      [
        {
          name: "PPT大纲",
          description: "列出PPT演示文稿的主要内容和结构。",
          sentence: "写一份PPT大纲",
          icons: ["el-icon-s-tools", "el-icon-success", "el-icon-warning"]
        }
      ]
    ])

    const handleToolButtonClick = (tool: Tool) => {
      dialogVisible.value = true
      dialogTitle.value = tool.name
      description.value = tool.description
      dialogConfirm = () => {
        dialogVisible.value = false
        dialogTitle.value = ""
        description.value = ""
        result.value = ""
      }
    }
    const handleClose = (done: () => void) => {
      // 可以在这里执行一些关闭前的操作
      ElMessageBox.confirm("确认关闭？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          done()
        })
        .catch(() => {
          // 取消操作
        })
    }

    let dialogConfirm = () => {
      dialogVisible.value = false
      dialogTitle.value = ""
      description.value = ""
      result.value = ""
    }
    const generate = async () => {
      const param: LLM_Interfaces.formParams = {
        content: inputText.value,
        template: dialogTitle.value,
        // @ts-ignore
        materialFiles: selectedOptions.value.map((key) => dictionary.value[key])
      }
      const tmp = await LLM_Interfaces.default.textGen(param)
      //@ts-ignore
      result.value = tmp.data.response
    }

    return {
      tools,
      handleToolButtonClick,
      dialogVisible,
      dialogConfirm,
      inputText,
      dialogTitle,
      handleClose,
      result,
      description,
      generate,
      options,
      selectedOptions
    }
  }
}
</script>

<style scoped>
.tool-button {
  display: inline-block;
  transition:
    transform 0.3s ease,
    background-color 0.3s ease;
  cursor: pointer;
  border: 1px solid #ccc; /* 添加边框 */
  padding: 10px; /* 添加内边距 */
  box-sizing: border-box; /* 确保边框和内边距包含在宽度和高度内 */
  height: 200px;
}

.tool-button-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.text {
  margin-bottom: 8px;
}

.icons {
  display: flex;
  justify-content: space-around;
  width: 100%;
}

.tool-button:hover {
  transform: scale(1.05);
  border-color: #409eff; /* 悬停时改变边框颜色 */
}

.tool-button:active {
  transform: scale(0.95);
  background-color: #f0f0f0;
  border-color: #409eff; /* 点击时改变边框颜色 */
  transition:
    transform 0.1s ease,
    background-color 0.1s ease;
}
.dialog-content {
  font-size: 26px; /* 增加弹窗内容的字体大小 */
}

.large-input {
  font-size: 20px; /* 增加输入框的字体大小 */
  width: 100%; /* 确保输入框宽度填充整个容器 */
  height: 100px; /* 可根据需要调整输入框的高度 */
  margin-bottom: 20px; /* 输入框与下方内容之间的间距 */
}

.result-container {
  font-size: 20px; /* 增加结果容器的字体大小 */
  /* 其他样式保持不变 */
}

.tools-page {
  padding: 20px; /* 页面内边距 */
}

.tools-page h1 {
  text-align: center;
  margin-bottom: 40px;
}

.tool-button-container {
  width: 100%; /* 使按钮容器宽度填充整个列 */
  padding: 10px; /* 按钮容器内边距 */
}

.result-container {
  padding: 10px;
  overflow: auto;
  box-shadow: 0 0 0 1px rgb(43, 41, 152); /* 随背景反色的框 */
}

/* 样式根据实际需求调整 */
</style>
