<template>
  <el-container>
    <el-aside width="50%" style="height: 100%">
      <el-form label-position="top" style="height: 90%">
        <h1>自定义工具</h1>
        <el-form-item label="约束条件">
          <el-input v-model="constraint" type="textarea" :rows="4" placeholder="请输入约束条件" />
        </el-form-item>
        <el-form-item label="目标文本">
          <el-input v-model="targetText" type="textarea" :rows="4" placeholder="请输入目标文本" />
        </el-form-item>
        <el-checkbox v-model="format">格式化</el-checkbox>
        <el-checkbox v-model="inputToEditor">录入编辑器</el-checkbox>
        <div style="margin-top: 10px" />
        <!-- 创建按钮之间的间隙 -->
        <el-button type="primary" @click="handleGenerate">生成</el-button>
        <el-button type="primary" @click="handleGenerate">清除结果</el-button>
      </el-form>
    </el-aside>
    <el-main style="padding: 10px">
      <el-container style="height: 100%">
        <el-main style="overflow: hidden">
          <div class="result-container">
            <div v-html="result" />
          </div>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { ref } from "vue"
import { ElContainer, ElAside, ElMain, ElForm, ElFormItem, ElInput, ElButton, ElCheckbox } from "element-plus"

export default {
  components: {
    ElContainer,
    ElAside,
    ElMain,
    ElForm,
    ElFormItem,
    ElInput,
    ElButton,
    ElCheckbox
  },
  setup(props, { emit }) {
    // 定义类型注解
    const constraint = ref<string>("")
    const targetText = ref<string>("")
    const format = ref<boolean>(false)
    const inputToEditor = ref<boolean>(false)
    const clear = ref<boolean>(false)
    const result = ref<string>("<p>输出结果<a href='#'></a>.</p>")

    function handleGenerate() {
      let generatedText = `约束条件: ${constraint.value}\n目标文本:${targetText.value}`

      if (format.value) {
        generatedText = generatedText.trim()
      }

      if (inputToEditor.value) {
        result.value = targetText.value
      } else {
        result.value = generatedText
      }

      if (clear.value) {
        result.value = ""
      }

      emit("generate", {
        result: result.value,
        format: format.value,
        inputToEditor: inputToEditor.value,
        clear: clear.value
      })
    }

    return {
      constraint,
      targetText,
      result,
      format,
      inputToEditor,
      clear,
      handleGenerate
    }
  }
}
</script>

<style scoped>
.result-container {
  padding: 10px;
  height: 100%;
  overflow: auto;
  box-shadow: 0 0 0 1px rgb(43, 41, 152); /* 随背景反色的框 */
}
</style>
