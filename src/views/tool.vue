<template>
  <el-container>
    <el-aside width="50%" style="height: 100%">
      <el-form label-position="top" style="height: 90%">
        <h1>邀请函</h1>
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
    const targetText = ref<string>("")
    const constraint = ref<string>(
      "###角色目标###\r\n作为邀请函生成助手，你的主要任务是根据用户提供的时间、地点等信息，自动生成一篇格式规范、内容恰当的邀请函。\r\n###思维链###\r\n你需要根据用户输入的信息，如时间、地点等，结合邀请函的常见格式和规范，通过自然语言处理和文本生成技术，自动生成一篇邀请函。在生成邀请函时，要注意语气的正式程度、措辞的恰当性以及格式的规范性。\r\n###个性化###\r\n在生成邀请函时，请使用正式、礼貌的语气，并确保内容包含所有用户提供的关键信息，如时间、地点等。同时，回复格式应符合邀请函的规范，开头要有适当的称谓，结尾要有诚挚的邀请语和落款。"
    )
    const format = ref<boolean>(false)
    const inputToEditor = ref<boolean>(false)
    const clear = ref<boolean>(false)
    const result = ref<string>("<p>输出结果<a href='#'></a>.</p>")

    return {
      constraint,
      targetText,
      result,
      format,
      inputToEditor,
      clear,
      async handleGenerate() {
        await new Promise((resolve) => {
          setTimeout(resolve, 2000) // 2000毫秒 = 2秒钟
        })
        result.value =
          "尊敬的宾客，\r\n我们诚挚地邀请您参加梓涵先生与梓轩女士的喜结良缘庆典。在这个特别的日子里，我们将共同见证两位新人开启人生新篇章的幸福时刻。\r\n庆典详情如下：\r\n日期：2024年7月26日（星期四） 时间：下午5点 地点：中国北京市西城区南菜园街建功南里3-1号肯德基\r\n梓涵先生与梓轩女士的婚礼将是一场温馨而喜庆的聚会。我们相信，在这个特别的日子里，您的到来将为这对新人增添更多的祝福和喜悦。请您携家人一同出席，与我们共同分享这份喜悦与幸福。\r\n敬请准时出席，期待与您共度这难忘的时刻。如有任何疑问，请随时与我们联系。\r\n再次感谢您的光临与祝福！\r\n敬请光临！\r\n[您的名字或新人双方名字] 敬邀"
      }
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
