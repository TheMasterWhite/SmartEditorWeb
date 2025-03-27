<!-- MyModal.vue -->
<template>
  <el-dialog title="提示" v-model:visible="dialogVisible" width="30%" @close="handleClose">
    <p>这是一个弹窗内容。</p>
    <template v-slot:footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { defineComponent, ref } from "vue"

export default defineComponent({
  name: "Bubble",
  setup() {
    const dialogVisible = ref(false)

    const confirm = () => {
      console.log("Confirmed")
      dialogVisible.value = false
    }

    const handleClose = () => {
      console.log("Dialog closed")
    }

    return {
      dialogVisible,
      confirm,
      handleClose
    }
  }
})
</script>

<style scoped>
/* 可以在这里编写样式 */
</style>
