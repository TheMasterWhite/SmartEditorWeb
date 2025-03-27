<template>
  <el-dropdown @command="handleCommand">
    <span class="el-dropdown-link">
      {{ selectedOption || placeholder }}
      <i class="el-icon-arrow-down el-icon--right" />
    </span>
    <template v-slot:dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="option in options" :key="option.value" :command="option.value">
          {{ option.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts">
import { ref } from "vue"

export default {
  name: "DropdownExample",
  props: {
    options: {
      type: Array as () => { label: string; value: string }[],
      required: true
    },
    placeholder: {
      type: String,
      default: "请选择"
    }
  },
  emits: ["update:selected"], // 定义一个自定义事件
  setup(props, { emit }) {
    const selectedOption = ref<null | string>(null)

    function handleCommand(command: string): void {
      selectedOption.value = command
      emit("update:selected", command) // 发送自定义事件
    }

    return {
      selectedOption,
      handleCommand
    }
  }
}
</script>

<style>
.el-dropdown-link {
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
}
</style>
