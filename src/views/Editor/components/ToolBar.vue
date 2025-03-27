<script lang="ts">
import { defineComponent } from "vue"
import DropdownExample from "./DropdownExample.vue"

export default defineComponent({
  components: {
    DropdownExample
  },
  data(): { dropdownOptions: { label: string; value: string }[] } {
    return {
      dropdownOptions: [
        { label: "情景：论文", value: "情景：论文" },
        { label: "情景：小说", value: "情景：小说" },
        { label: "情景：应用文", value: "情景：应用文" },
        { label: "情景：诗歌", value: "情景：诗歌" },
        { label: "情景：无", value: "情景：无" }
      ]
    }
  },
  name: "Toolbar",
  methods: {
    handleLeftBtn1() {
      // 左按钮1 点击触发的空方法
    },
    handleLeftBtn2() {
      // 左按钮2 点击触发的空方法
    },
    handleLeftBtn3() {
      // 左按钮3 点击触发的空方法
    },
    handleLeftBtn4() {
      // 左按钮4 点击触发的空方法
    }
  }
})
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
</style>
