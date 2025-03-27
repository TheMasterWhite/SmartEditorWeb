<template slot-scope="scope">
  <div style="border: 1px solid #ccc">
    <div style="width: 70%; float: left; height: 100%">
      <div class="toolbar">
        <!-- 左侧工具栏 -->
        <div class="toolbar-left">
          <el-button class="bounce-button" svgIcon="AItrans" @click="AItrans_method">AI翻译</el-button>
          <el-button class="bounce-button" svgIcon="AIsum" @click="AIsum_method">AI总结</el-button>
          <el-button class="bounce-button" svgIcon="AIjustify" @click="AIjustify_method">AI纠错</el-button>
          <el-button class="bounce-button" svgIcon="AIbeautify" @click="AIbeautify_method">AI润色</el-button>
          <el-button class="bounce-button" svgIcon="AIbeautify" @click="Doc_download">下载文档</el-button>
          <el-button class="bounce-button" svgIcon="AIbeautify" @click="Doc_upload">保存文档</el-button>
        </div>

        <!-- 右侧工具栏 -->
        <div class="toolbar-right">
          <DropdownExample
            :options="languageOptions"
            placeholder="目标语言：英语"
            class="languageSelection"
            @update:selected="handleLanguageSelection"
          />
          <DropdownExample :options="dropdownOptions" placeholder="情景：通用" class="SceneSelection" />
        </div>
      </div>
      <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
      <Editor
        style="height: 84%; overflow-y: hidden"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
      />
    </div>
    <div style="width: 30%; float: right; height: 100%">
      <ChatBot style="width: 100%; height: 100%; background-color: #fff" />
    </div>
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="30%" :before-close="handleClose">
      <el-icon v-if="fileStatus === 'uploading'" class="uploading-icon">
        <Loading />
      </el-icon>
      <el-icon v-else-if="fileStatus === 'success'" class="success-icon">
        <CircleCheck />
      </el-icon>
      <el-icon v-else-if="fileStatus === 'error'" class="error-icon">
        <CircleClose />
      </el-icon>
      <div class="dialog-content">
        <textarea v-model="inputText" placeholder="请输入内容" autocomplete="off" class="large-input" />
      </div>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogConfirm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import "@wangeditor/editor/dist/css/style.css" // 引入 css

import { onBeforeUnmount, ref, shallowRef, onMounted } from "vue"
import { Editor, Toolbar } from "@wangeditor/editor-for-vue"
import ChatBot from "./components/ChatBot.vue"
import DropdownExample from "./components/DropdownExample.vue"
import { IDomEditor } from "@wangeditor/editor"
import * as LLM_Interfaces from "@/api/LLM-Interfaces/index"
import * as file_Interfaces from "@/api/file-interfaces/index"
import { ElMessageBox } from "element-plus"
import { ElNotification } from "element-plus"

export default {
  components: { Editor, Toolbar, ChatBot, DropdownExample }, // 注意这里没有 toolbar，可能是笔误
  setup() {
    // 编辑器实例，必须用 shallowRef
    const editorRef = shallowRef()
    const dialogVisible = ref(false)
    const dialogTitle = ref("")
    const inputText = ref("")
    const dialogConfirm = ref(() => {})
    const fileStatus = ref("uploading")
    const languageSelected = ref("")

    // 内容 HTML
    const valueHtml = ref("<p></p>")
    const value = localStorage.getItem("mainPageUtilsResult")

    if (value != null) {
      //valueHtml.value = `<p>${value}</p>`
      console.log(value.includes("\\n"))
      console.log(value)
      console.log(
        value
          .split("\\n")
          .map((line) => `<p>${line}</p>`)
          .join("")
      )
      valueHtml.value = value
        .substring(1, value.length - 1)
        .split("\\n")
        .map((line) => `<p>${line}</p>`)
        .join("")
      localStorage.removeItem("mainPageUtilsResult")
    }
    //valueHtml.value = `<p>aaa</p>`
    // 模拟 ajax 异步获取内容
    onMounted(() => {})

    const toolbarConfig = {}
    const editorConfig = { placeholder: "请输入内容..." }

    // 组件销毁时，也及时销毁编辑器
    onBeforeUnmount(() => {
      const editor = editorRef.value
      if (editor == null) return
      editor.destroy()
    })
    // @ts-ignore
    const handleLanguageSelection = (selectedValue) => {
      // 在这里，你可以使用 selectedValue
      //console.log("选中的值是：", selectedValue)
      languageSelected.value = selectedValue.slice(5)
    }
    const handleCreated = (editor: IDomEditor) => {
      editorRef.value = editor // 记录 editor 实例，重要！
    }

    // 处理函数的类型注解
    const AItrans_method = async (): Promise<void> => {
      inputText.value = ""
      const content = editorRef.value.getSelectionText()
      // const test = "test_translate"
      const param: LLM_Interfaces.TranslateParams = {
        content: content,
        language: languageSelected.value
      }

      dialogVisible.value = true
      dialogTitle.value = "翻译"
      const result = await LLM_Interfaces.default.translate(param)
      // @ts-ignore
      if (result.data.statusCode) {
        fileStatus.value = "success"
      } else {
        fileStatus.value = "error"
      }

      // @ts-ignore
      inputText.value = result.data.response
      dialogConfirm.value = () => {
        dialogVisible.value = false
        inputText.value = ""
        fileStatus.value = "uploading"
      }
      // @ts-ignore
      // editorRef.value.insertText(result.data.response)

      // ... 省略其他代码
    }

    const AIsum_method = async (): Promise<void> => {
      inputText.value = ""
      const content = editorRef.value.getHtml()
      // const test = "test_sum"
      const param: LLM_Interfaces.CommonParams = {
        content: content
      }

      dialogVisible.value = true
      dialogTitle.value = "总结"
      const result = await LLM_Interfaces.default.summary(param)
      // @ts-ignore
      if (result.data.statusCode) {
        fileStatus.value = "success"
      } else {
        fileStatus.value = "error"
      }

      // @ts-ignore
      inputText.value = result.data.response
      dialogConfirm.value = () => {
        dialogVisible.value = false
        inputText.value = ""
        fileStatus.value = "uploading"
      }
      // 现在result是ResponseType类型，你可以安全地访问response属性
      // @ts-ignore
      //editorRef.value.dangerouslyInsertHtml(result.data.response)
      // ... 省略其他代码
    }

    const AIjustify_method = async (): Promise<void> => {
      inputText.value = ""
      const content = editorRef.value.getSelectionText()
      // const test = "test_justify"
      const param: LLM_Interfaces.CommonParams = {
        content: content
      }
      dialogVisible.value = true
      dialogTitle.value = "纠错"
      const result = await LLM_Interfaces.default.correct(param)
      // @ts-ignore
      if (result.data.statusCode) {
        fileStatus.value = "success"
      } else {
        fileStatus.value = "error"
      }

      // @ts-ignore
      inputText.value = result.data.response
      dialogConfirm.value = () => {
        dialogVisible.value = false
        inputText.value = ""
        fileStatus.value = "uploading"
      }
      // @ts-ignore
      //editorRef.value.insertText(result.data.response)
      // ... 省略其他代码
    }

    const AIbeautify_method = async (): Promise<void> => {
      inputText.value = ""
      const content = editorRef.value.getSelectionText()
      // const test = "test_beautify"
      const param: LLM_Interfaces.CommonParams = {
        content: content
      }
      dialogVisible.value = true
      dialogTitle.value = "润色"
      const result = await LLM_Interfaces.default.polish(param)
      // @ts-ignore
      if (result.data.statusCode) {
        fileStatus.value = "success"
      } else {
        fileStatus.value = "error"
      }

      // @ts-ignore
      inputText.value = result.data.response
      dialogConfirm.value = () => {
        dialogVisible.value = false
        inputText.value = ""
        fileStatus.value = "uploading"
      }

      //editorRef.value.insertText()
      // ... 省略其他代码
    }
    const Doc_download = async (): Promise<void> => {
      const result = editorRef.value.getHtml()
      const fileName: string = "tmp"
      const param: { fileName: string; content: string } = {
        fileName: fileName,
        content: result
      }
      await file_Interfaces.default.saveFile(param)
      const downloadUrl = "http://8.148.25.61:8888/Service/DownloadFile/tmp"
      window.location.href = downloadUrl
      // @ts-ignore
      file_Interfaces.default.deleteFile({ fileName: "tmp" })
    }
    const Doc_upload = async (): Promise<void> => {
      const result = editorRef.value.getHtml()
      // dialogVisible.value = true
      // dialogTitle.value = "上传文件"
      // dialogConfirm.value = () => {
      //   // const fileName: string = inputText.value

      //   // ... 省略其他代码}
      // }
      const param: { content: string } = {
        content: result
      }
      await file_Interfaces.default.saveFile(param)
      ElNotification({
        title: "success",
        type: "success",
        dangerouslyUseHTMLString: true,
        message: "<a style='color: teal' target='_blank'>文档保存成功</a>",
        duration: 3000,
        position: "bottom-right"
      })
      //dialogVisible.value = false
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
    // @ts-ignore

    return {
      editorRef,
      valueHtml,
      mode: "default", // 或 'simple'
      toolbarConfig,
      editorConfig,
      handleCreated,
      dropdownOptions: [
        { label: "情景：论文", value: "情景：论文" },
        { label: "情景：小说", value: "情景：小说" },
        { label: "情景：应用文", value: "情景：应用文" },
        { label: "情景：诗歌", value: "情景：诗歌" },
        { label: "情景：通用", value: "情景：通用" }
      ],
      AItrans_method,
      AIsum_method,
      AIjustify_method,
      AIbeautify_method,
      Doc_download,
      Doc_upload,
      dialogVisible,
      handleClose,
      dialogTitle,
      inputText,
      dialogConfirm,
      fileStatus,
      languageOptions: [
        { label: "中文", value: "目标语言：中文" },
        { label: "英语", value: "目标语言：英语" },
        { label: "日语", value: "目标语言：日语" },
        { label: "法语", value: "目标语言：法语" },
        { label: "德语", value: "目标语言：德语" },
        { label: "俄语", value: "目标语言：俄语" }
      ],
      handleLanguageSelection,
      languageSelected

      //["英语", "日语", "法语", "德语", "俄语", "西班牙语"]
    }
  }
}
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  padding: 10px;
}

.toolbar-left,
.toolbar-right {
  display: flex;
}

.toolbar-left el-button,
.toolbar-right el-button {
  margin-right: 10px;
}
.bounce-button {
  padding: 10px 20px;
  border: 1px solid #ccc;
  background-color: #ffffff;
  color: #000000;
  transition:
    transform 0.3s ease,
    background-color 0.3s ease;
}

.bounce-button:hover {
  background-color: #e0e0e0;
}

.bounce-button:active {
  transform: scale(0.95); /* 缩小按钮 */
}
/* 添加一些样式来使输入框居中并且更大 */

.large-input {
  width: 80%; /* 输入框宽度设置为80% */
  height: auto; /* 让高度自适应 */
  padding: 16px; /* 增加内边距，使输入框看起来更大 */
  font-size: 16px; /* 增加字体大小 */
}
/* 添加一些样式来使输入框居中并且更大 */
.dialog-content {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  height: 100%; /* 使容器占满整个对话框的高度 */
}
</style>

function async() { throw new Error('Function not implemented.') }
