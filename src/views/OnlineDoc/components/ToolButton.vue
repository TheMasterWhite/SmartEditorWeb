<template>
  <div
    class="tool-button"
    @mouseover="handleMouseOver"
    @mouseleave="handleMouseLeave"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
  >
    <div class="tool-button-content">
      <div class="name-time-container">
        <div class="text larger-text">{{ tool.fileName }}</div>
        <div class="time">{{ tool.saveTime }}</div>
      </div>
    </div>
    <div class="action-buttons">
      <div class="description">{{ tool.description }}</div>
      <el-button type="danger" size="small" @click="onDeleteClick">删除</el-button>
      <el-button type="primary" size="small" @click="onEditClick">浏览素材</el-button>
      <el-button type="primary" size="small" @click="downloadClick">下载文件</el-button>
      <el-button type="primary" size="small" @click="checkClick">知识库检查</el-button>
    </div>
    <!-- 描述信息元素 -->
    <!-- <div class="tool-button-description" v-if="isHovered">{{ tool.sentence }}</div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"
import { ElIcon } from "element-plus"

export default defineComponent({
  components: {},
  props: {
    tool: {
      type: Object as () => Record<string, any>,
      required: true
    },
    iconSize: {
      type: String,
      default: "medium"
    },
    description: {
      type: String,
      required: false
    }
  },
  setup(props, { emit }) {
    const onDeleteClick = () => {
      emit("delete", props.tool) // 发出事件，传递name字段
    }
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

    const onEditClick = () => {
      emit("editClick", props.tool)
    }
    const downloadClick = () => {
      emit("downloadClick", props.tool)
    }
    const checkClick = () => {
      emit("checkClick", props.tool)
    }

    return {
      isHovered,
      isClicked,
      handleMouseOver,
      handleMouseLeave,
      handleMouseDown,
      handleMouseUp,
      onDeleteClick,
      onEditClick,
      downloadClick,
      checkClick
    }
  }
})
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
  align-items: left;
  justify-content: center;
}

.text {
  margin-bottom: 8px;
}

.tool-button:hover {
  transform: scale(1.015);
  border-color: #409eff; /* 悬停时改变边框颜色 */
}

/* .tool-button:active {
  transform: scale(0.9);
  background-color: #f0f0f0; 
  transition:
    transform 0.1s ease,
    background-color 0.1s ease;
} */
.tool-button-description {
  display: none; /* 默认不显示描述信息 */
  position: absolute; /* 定位描述信息元素 */
  bottom: 100%; /* 描述信息在按钮下方 */
  left: 0; /* 描述信息左对齐 */
  width: 100%; /* 描述信息宽度与按钮相同 */
  padding: 10px; /* 描述信息内边距 */
  background-color: #333; /* 描述信息背景色 */
  color: #ffffff; /* 描述信息文本颜色 */
  text-align: center; /* 描述信息文本居中 */
  border-radius: 4px; /* 描述信息边框圆角 */
  z-index: 10; /* 描述信息在按钮上方 */
}

.tool-button:hover .tool-button-description {
  display: block; /* 鼠标悬停时显示描述信息 */
}
.larger-text {
  font-size: 24px; /* 根据需要调整上面那行文字的字体大小 */
}

.description {
  margin-top: 12px; /* 调整描述文字与上面文字的垂直间距 */
}
.name-time-container {
  display: flex; /* 使用Flexbox布局 */
  align-items: center; /* 垂直居中对齐 */
  justify-content: space-between; /* 水平两端对齐，时间字段在右边 */
}

.text {
  margin-right: 8px; /* 添加右边距，确保与时间字段有间隔 */
}

.time {
  font-size: 14px; /* 设置时间字段字体大小 */
  color: #666; /* 设置时间字段颜色 */
}
.action-buttons {
  display: flex;
  justify-content: flex-end; /* 按钮靠右对齐 */
  margin-top: 10px; /* 添加上边距，与上面的内容隔开 */
}
.description {
  margin-top: 12px; /* 调整描述文字与上面文字的垂直间距 */
  width: 100%; /* 描述文本宽度100%，确保靠左 */
}
</style>
