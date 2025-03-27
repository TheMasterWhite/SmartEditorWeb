<!-- ToolsPage.vue -->
<template>
  <div class="tools-page">
    <div>
      <UserInfo />
    </div>
    <h1>充值</h1>
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
</template>

<script lang="ts">
import { ref } from "vue"
import ToolButton from "./components/ToolButton.vue"
import { ElRow, ElCol } from "element-plus"
import UserInfo from "./components/UserInfo.vue"

export default {
  name: "ToolsPage",
  components: {
    ToolButton,
    ElRow,
    ElCol,
    UserInfo
  },
  setup() {
    // 定义工具类型
    interface Tool {
      name: string
      description: string
      icons: string[]
    }

    // 使用类型注解
    const tools = ref<Array<Array<Tool>>>([
      [
        {
          name: "金额5",
          description: "这是金额5的描述",
          icons: ["el-icon-s-tools", "el-icon-success", "el-icon-warning"]
        }
      ],
      [
        {
          name: "金额10",
          description: "这是金额10的描述",
          icons: ["el-icon-s-tools", "el-icon-success", "el-icon-warning"]
        }
      ],
      [
        {
          name: "金额50",
          description: "这是金额50的描述",
          icons: ["el-icon-s-tools", "el-icon-success", "el-icon-warning"]
        }
      ]
    ])

    const handleToolButtonClick = (tool: Tool) => {
      console.log(`Tool clicked: ${tool.name}`)
    }

    return { tools, handleToolButtonClick }
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
  transform: scale(1.1);
  border-color: #409eff; /* 悬停时改变边框颜色 */
}

.tool-button:active {
  transform: scale(0.9);
  background-color: #f0f0f0;
  border-color: #409eff; /* 点击时改变边框颜色 */
  transition:
    transform 0.1s ease,
    background-color 0.1s ease;
}
</style>
<style scoped>
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

/* 样式根据实际需求调整 */
</style>

<!-- 充值及用户余额使用规则
  <div class="rules">
    <p>充值及用户余额使用规则描述...</p>
  </div> -->
