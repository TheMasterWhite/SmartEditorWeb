<template>
  <div class="chat-bot">
    <el-container>
      <el-main>
        <!-- 聊天内容区域 -->
        <div v-for="(message, index) in messages" :key="index" class="chat-message">
          <div v-if="message.type === 'user'" class="message user">
            {{ message.content }}
          </div>
          <div v-else class="message bot">
            {{ message.content }}
          </div>
        </div>
      </el-main>
      <el-footer>
        <!-- 输入框和发送按钮，水平排列 -->
        <div class="input-button-container">
          <el-input v-model="newMessage" placeholder="请输入消息..." @keyup.enter="sendMessage" style="color: #000" />
          <el-button @click="sendMessage" type="primary">发送</el-button>
          <el-button @click="loadFile" type="primary">加载知识库</el-button>
        </div>
        <div />
      </el-footer>
    </el-container>
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="50%" :before-close="handleClose">
      <div class="dialog-content">
        <el-checkbox v-model="selectedOptions" v-for="option in options" :key="option" :label="option">
          {{ option }}
        </el-checkbox>
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
import { ref } from "vue"
import * as LLMInterfaces from "@/api/LLM-Interfaces"
import { ArrayTypeNode } from "typescript"
import * as file_Interfaces from "@/api/file-interfaces/index"

// 假设这是 chatBot 函数返回的响应类型
interface ResponseType {
  response: string
  // 可能还有其他属性
}
interface dataType {
  content: string
  fileName: Array<string>
  userId: string
}

export default {
  name: "ChatBot",
  data(): {
    newMessage: string
    messages: { content: string; type: "user" | "bot" }[]
    dialogVisible: boolean
    options: Array<string>
    dialogTitle: string
    selectedOptions: Array<string>
  } {
    return {
      newMessage: "", // 用户输入的新消息
      messages: [
        // 消息列表，包含用户和机器人的消息
        { content: "你好！", type: "bot" }
      ],
      dialogVisible: false,
      options: [],
      dialogTitle: "加载知识库",
      selectedOptions: []
    }
  },
  methods: {
    async sendMessage() {
      const dictionary = ref({})
      // 发送用户输入的消息，并将其显示在对话框中
      if (this.newMessage.trim() !== "") {
        this.messages.push({ content: this.newMessage, type: "user" })
        const param: LLMInterfaces.ChatBotParams = {
          content: this.newMessage,
          // @ts-ignore
          fileName: this.selectedOptions.map((key) => dictionary.value[key])
        }

        this.newMessage = ""
        // 等待异步函数的结果
        LLMInterfaces.default.check
        const botResponse = await LLMInterfaces.default.chatBot(param)
        // 提取 content 属性作为字符串
        this.messages.push({
          // @ts-ignore
          content: botResponse.data.response, // 确保只传递字符串
          type: "bot"
        })
        console.log(botResponse)
        // 清空输入框
      }
    },
    async loadFile() {
      async function fetchData() {
        try {
          const result = await file_Interfaces.default.getFile()
          return result
        } catch (error) {
          // 处理可能出现的错误
          console.error("An error occurred:", error)
        }
      }

      fetchData()
        .then((data) => {
          // @ts-ignore
          const tools = data.data.response // 当 fetchData 成功解析时，更新 tools
          // eslint-disable-next-line no-global-assign
          //@ts-ignore
          this.options = tools.map((item) => item.fileName)
          // @ts-ignore
          dictionary.value = tools.reduce((acc, tools) => ({ ...acc, [tools.fileName]: tools.uuid }), {})
        })
        .catch((error) => {
          console.error("Failed to fetch data:", error)
        })
      this.dialogVisible = true
    },
    async dialogConfirm() {
      this.dialogVisible = false
    },
    async handleClose(done: () => void) {
      // 可以在这里执行一些关闭前的操作
      //@ts-ignore
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
  }
}
</script>

<style scoped>
.chat-bot {
  width: 100%; /* 控件宽度 */
  margin: 0 auto; /* 居中显示 */
  border: 0px solid #ccc; /* 控件边框 */
  padding: 0px; /* 控件内边距 */
}

.chat-message {
  margin-bottom: 10px;
}

.message {
  padding: 10px;
  border-radius: 5px;
  margin: 5px 0;
  color: #000; /* 黑色字体 */
}

.user {
  background-color: #f0f0f0;
  text-align: right;
}

.bot {
  background-color: #d9edf7;
  text-align: left;
}

.input-button-container > * {
  margin-right: 10px; /* 控件之间的间距 */
}
.el-container {
  border: 1px solid #ccc;
  overflow-y: hidden; /* 当内容超出时显示滚动条 */
  max-height: 85vh; /*设置基于视口高度的最大高度*/
  height: 100vh; /*设置一个固定的最大高度 */
}
</style>
