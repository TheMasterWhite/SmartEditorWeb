<!-- ToolButton.vue -->
<template>
  <div
    class="tool-button"
    @mouseover="handleMouseOver"
    @mouseleave="handleMouseLeave"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @click="onToolButtonClick"
  >
    <div class="tool-button-content">
      <div class="text">{{ tool.name }}</div>
      <div class="icons">
        <el-icon v-for="(icon, index) in tool.icons" :key="index" :size="iconSize">
          <component :is="icon" />
        </el-icon>
      </div>
    </div>
    <!-- 描述信息元素 -->
    <div class="tool-button-description" v-if="isHovered">{{ tool.description }}</div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue"
import { ElIcon } from "element-plus"

export default {
  components: {
    ElIcon
  },
  props: {
    tool: {
      type: Object,
      required: true
    },
    iconSize: {
      type: String,
      default: "medium"
    }
  },
  setup(props, { emit }) {
    // 定义类型注解
    const isHovered = ref<boolean>(false)
    const isClicked = ref<boolean>(false)

    const handleMouseOver = () => {
      isHovered.value = true
    }

    const handleMouseLeave = () => {
      isHovered.value = false
    }

    const handleMouseDown = () => {
      isClicked.value = true
    }

    const handleMouseUp = () => {
      isClicked.value = false
    }

    const onToolButtonClick = () => {
      emit("click", props.tool)
    }

    return {
      isHovered,
      isClicked,
      handleMouseOver,
      handleMouseLeave,
      handleMouseDown,
      handleMouseUp,
      onToolButtonClick
    }
  }
}
</script>

<style scoped>
.tool-button {
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
}

.tool-button:active {
  transform: scale(0.9);
  background-color: #f0f0f0; /* Example color for the click effect */
  transition:
    transform 0.1s ease,
    background-color 0.1s ease;
}
.tool-button-description {
  display: none; /* 默认不显示描述信息 */
  position: absolute; /* 定位描述信息元素 */
  bottom: 100%; /* 描述信息在按钮下方 */
  left: 0; /* 描述信息左对齐 */
  width: 100%; /* 描述信息宽度与按钮相同 */
  padding: 10px; /* 描述信息内边距 */
  background-color: #409eff; /* 描述信息背景色 */
  color: #fff; /* 描述信息文本颜色 */
  text-align: center; /* 描述信息文本居中 */
  border-radius: 4px; /* 描述信息边框圆角 */
  z-index: 10; /* 描述信息在按钮上方 */
}

.tool-button:hover .tool-button-description {
  display: block; /* 鼠标悬停时显示描述信息 */
}
</style>
