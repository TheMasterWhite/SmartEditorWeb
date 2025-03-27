<template>
  <div class="main-container">
    <div style="width: 70%; display: flex; justify-content: center">
      <el-container class="inner-container" style="height: 30%; width: 70%; background-color: #eeebfe">
        <!-- 第一部分：输入框和确定按钮 -->
        <el-row class="input-row" type="flex" justify="center" align="middle">
          <el-col :span="24">
            <div style="display: flex; width: 100%">
              <!-- <el-input v-model="inputType" placeholder="类型（可选）" style="flex-grow: 1; height: 5vh" /> -->
              <el-input v-model="inputContent" placeholder="需要AI写什么" style="flex-grow: 1; height: 5vh" />
              <el-button type="primary" @click="submitContent" style="margin-left: 10px; height: 5vh">确定</el-button>
            </div>
          </el-col>
        </el-row>
        <!-- 第二部分：三个可以点击的词条 -->
        <el-row
          v-for="(term, index) in terms"
          :key="index"
          class="term-row"
          type="flex"
          justify="center"
          align="middle"
        >
          <el-col :span="24">
            <div class="term" @click="handleTermClick(term)">
              <!-- <span>{{ term.type || "•" }}</span> -->
              <span>{{ term.content }}</span>
            </div>
          </el-col>
        </el-row>
      </el-container>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"
import { ElContainer, ElRow, ElCol, ElInput, ElButton } from "element-plus"
import * as LLMInterfaces from "@/api/LLM-Interfaces"
import router from "@/router"
import { ElNotification } from "element-plus"

export default defineComponent({
  name: "MainPage",
  components: {
    ElContainer,
    ElRow,
    ElCol,
    ElInput,
    ElButton
  },
  setup() {
    const inputContent = ref("")
    const terms = ref([
      { content: "写一篇关于科技创新对经济发展的推动作用的文章。" },
      { content: "写一份百度飞桨平台的产品推广文案。" },
      { content: "创作一篇关于环保主题的短篇小说。" }
    ])

    const submitContent = async () => {
      ElNotification({
        title: "success",
        type: "success",
        dangerouslyUseHTMLString: true,
        message: "<a style='color: teal' target='_blank'>文章生成中，请稍后。</a>",
        duration: 3000,
        position: "bottom-right"
      })
      // 输出输入框的内容到控制台
      console.log("输入框的内容:", inputContent.value)
      const result = await LLMInterfaces.default.mainPageUtils({ content: inputContent.value })
      console.log(result)
      // @ts-ignore
      console.log(result.data.response)
      // @ts-ignore
      localStorage.setItem("mainPageUtilsResult", JSON.stringify(result.data.response))
      // 跳转到另一个页面
      router.push({ path: "/editor/editor" })
      //window.location.href = "//editor//editor" // 假设这是要跳转的页面的URL
    }

    const handleTermClick = (term: { content: string }) => {
      // 将点击的词条内容设置到输入框中
      inputContent.value = term.content
    }

    return {
      inputContent,
      terms,
      submitContent,
      handleTermClick
    }
  }
})
</script>

<style scoped>
.main-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.inner-container {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 30px;
  border: 1px solid #ccc;
  transition:
    transform 0.3s ease,
    background-color 0.3s ease;
  cursor: pointer;
  border-radius: 20px; /* 添加这个属性来设置圆角的大小 */
  overflow: hidden; /* 如果内容超出边界，确保被圆角裁剪 */
}

.input-row {
  width: 100%;
}

.term-row {
  width: 100%;
  margin-top: 10px;
}

.term {
  cursor: pointer;
  padding: 10px;
  border: 1px solid #ccc;
  text-align: center;
  width: 100%;
}

.inner-container:hover {
  transform: scale(1);
  border-color: #409eff; /* 点击时改变边框颜色 */
}

.term-row {
  border: 1px solid #ccc;
  transition:
    transform 0.3s ease,
    background-color 0.3s ease;
}

.term-row:hover {
  transform: scale(1);
  border-color: #409eff; /* 点击时改变边框颜色 */
}

.term-row:active {
  transform: scale(0.9);
  background-color: #f0f0f0;
  transition:
    transform 0.1s ease,
    background-color 0.1s ease;
  border-color: #409eff;
}
</style>
