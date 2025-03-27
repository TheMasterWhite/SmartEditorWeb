<template>
  <el-row class="input-row">
    <el-col :span="24">
      <div style="display: flex; width: 100%">
        <!-- <el-input v-model="inputType" placeholder="类型（可选）" style="flex-grow: 1; height: 5vh" /> -->
        <el-input v-model="inputContent" placeholder="内容" style="flex-grow: 1; height: 5vh" />
        <el-button type="primary" @click="getCatalog" style="margin-left: 10px; height: 5vh">大纲生成</el-button>
        <el-button type="primary" @click="materialChoose" style="margin-left: 10px; height: 5vh">素材选择</el-button>
        <el-button type="primary" @click="submitContent" style="margin-left: 10px; height: 5vh">确定</el-button>
      </div>
    </el-col>
  </el-row>
  <div>
    <!-- 增加具有固定文本和可编辑文本框的节点按钮 -->
    <el-button @click="addEditableNode" :disabled="!canAddEditableNode">增加页标签</el-button>
    <!-- 增加具有子节点的节点按钮 -->
    <el-button @click="addParentNode" :disabled="!canAddParentNode">增加章节</el-button>
    <!-- 删除按钮 -->
    <el-button @click="removeNode" :disabled="!selectedNode">删除节点</el-button>

    <el-tree
      :data="treeData"
      :props="defaultProps"
      @node-click="handleNodeClick"
      node-key="id"
      default-expand-all
      highlight-current
      ref="treeRef"
    >
      <template #default="{ node, data }">
        <!-- 固定文字和可编辑文本框的节点 -->
        <span v-if="data.type === 'editable'" class="tree-node">
          <span>{{ data.fixedLabel }}</span>
          <el-input v-model="data.editableLabel" size="small" @blur="finishEdit(node, data)" />
        </span>
        <!-- 固定文字和子节点的节点 -->
        <span v-else-if="data.type === 'parent'" class="tree-node">
          <span>{{ data.fixedLabel }}</span>
        </span>
        <!-- 默认节点，与原来相同 -->
        <span v-else class="tree-node" @dblclick="editNodeLabel(node, data)">
          <span v-if="data.edit">
            <el-input v-model="data.label" size="small" @blur="finishEdit(node, data)" />
          </span>
          <span v-else>{{ node.label }}</span>
        </span>
      </template>
    </el-tree>
  </div>
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
</template>

<script lang="ts">
import { defineComponent, ref, computed, nextTick } from "vue"
import extractDataFromEditableItems from "./utils/catalogExcute"
import reverseDataObjectToItems from "./utils/catalogUnExcute"
import * as LLMInterfaces from "@/api/LLM-Interfaces"
import * as file_Interfaces from "@/api/file-interfaces/index"
import { ElNotification } from "element-plus"

export default defineComponent({
  setup() {
    const treeData = ref([
      {
        id: 1,
        type: "parent",
        fixedLabel: "基本信息",
        children: [
          {
            id: 11,
            type: "editable",
            fixedLabel: "主标题：",
            editableLabel: ""
          },
          {
            id: 12,
            type: "editable",
            fixedLabel: "副标题：",
            editableLabel: ""
          },
          {
            id: 13,
            type: "editable",
            fixedLabel: "汇报人：",
            editableLabel: ""
          }
        ]
      },
      {
        id: 2,
        type: "parent",
        fixedLabel: "内容",
        children: [
          {
            id: Date.now(),
            type: "parent",
            fixedLabel: "章节",
            children: [
              {
                id: Date.now(),
                type: "editable",
                fixedLabel: "章节标题：",
                editableLabel: ""
              },
              {
                id: Date.now(),
                type: "parent",
                fixedLabel: "章节内容",
                children: [
                  {
                    id: Date.now(),
                    type: "editable",
                    fixedLabel: "页标签1：",
                    editableLabel: ""
                  },
                  {
                    id: Date.now(),
                    type: "editable",
                    fixedLabel: "页标签2：",
                    editableLabel: ""
                  },
                  {
                    id: Date.now(),
                    type: "editable",
                    fixedLabel: "页标签3：",
                    editableLabel: ""
                  }
                ]
              }
            ]
          },
          {
            id: Date.now(),
            type: "parent",
            fixedLabel: "章节",
            children: [
              {
                id: Date.now(),
                type: "editable",
                fixedLabel: "章节标题：",
                editableLabel: ""
              },
              {
                id: Date.now(),
                type: "parent",
                fixedLabel: "章节内容",
                children: [
                  {
                    id: Date.now(),
                    type: "editable",
                    fixedLabel: "页标签1：",
                    editableLabel: ""
                  },
                  {
                    id: Date.now(),
                    type: "editable",
                    fixedLabel: "页标签2：",
                    editableLabel: ""
                  },
                  {
                    id: Date.now(),
                    type: "editable",
                    fixedLabel: "页标签3：",
                    editableLabel: ""
                  }
                ]
              }
            ]
          }
        ]
      }
    ])

    const inputContent = ref("")
    const dialogTitle = ref("test1")
    const dialogVisible = ref(false)
    const selectedOptions = ref([])
    const options = ref([])
    const dictionary = ref({})

    const defaultProps = {
      children: "children",
      label: "label"
    }
    const selectedNode = ref(null)
    const treeRef = ref(null)

    const canAddParentNode = computed(() => {
      // @ts-ignore
      if (!selectedNode.value || selectedNode.value.data.fixedLabel !== "内容") {
        return false
      }
      // @ts-ignore
      const parentChildren = selectedNode.value.data.children.filter((child) => child.type === "parent")
      return parentChildren.length < 6
    })

    const canAddEditableNode = computed(() => {
      // @ts-ignore
      if (!selectedNode.value || selectedNode.value.data.fixedLabel !== "章节内容") {
        return false
      }
      return true
    })

    const addEditableNode = () => {
      // @ts-ignore
      if (selectedNode.value && selectedNode.value.data.children) {
        // @ts-ignore
        const existingPageCount = selectedNode.value.data.children.filter((child) => child.type === "editable").length
        const newNode = {
          id: Date.now(),
          type: "editable",
          fixedLabel: `页标签${existingPageCount + 1}：`,
          editableLabel: ""
        }
        // @ts-ignore
        selectedNode.value.data.children.push(newNode)
      }
    }

    const addParentNode = () => {
      // @ts-ignore
      if (selectedNode.value && selectedNode.value.data.fixedLabel === "内容") {
        const newNode = {
          id: Date.now(),
          type: "parent",
          fixedLabel: "章节",
          children: [
            {
              id: Date.now(),
              type: "editable",
              fixedLabel: "章节标题：",
              editableLabel: ""
            },
            {
              id: Date.now(),
              type: "parent",
              fixedLabel: "章节内容",
              children: [
                {
                  id: Date.now(),
                  type: "editable",
                  fixedLabel: "页标签1：",
                  editableLabel: ""
                },
                {
                  id: Date.now(),
                  type: "editable",
                  fixedLabel: "页标签2：",
                  editableLabel: ""
                },
                {
                  id: Date.now(),
                  type: "editable",
                  fixedLabel: "页标签3：",
                  editableLabel: ""
                }
              ]
            }
          ]
        }
        // @ts-ignore
        selectedNode.value.data.children.push(newNode)
      }
    }

    const removeNode = () => {
      if (selectedNode.value) {
        // @ts-ignore
        const findParent = (data, tree) => {
          for (const item of tree) {
            if (item.children) {
              if (item.children.includes(data)) {
                return item
              } else {
                // @ts-ignore
                const parent = findParent(data, item.children)
                if (parent) return parent
              }
            }
          }
          return null
        }
        // @ts-ignore
        const parent = findParent(selectedNode.value.data, treeData.value)
        if (parent) {
          // @ts-ignore
          const index = parent.children.indexOf(selectedNode.value.data)
          if (index !== -1) {
            parent.children.splice(index, 1)
          }
        } else {
          // @ts-ignore
          const index = treeData.value.indexOf(selectedNode.value.data)
          if (index !== -1) {
            treeData.value.splice(index, 1)
          }
        }
        selectedNode.value = null
      }
    }
    // @ts-ignore
    const handleNodeClick = (data, node) => {
      selectedNode.value = node
    }
    // @ts-ignore
    const editNodeLabel = (node, data) => {
      data.edit = true
      nextTick(() => {
        // @ts-ignore
        const input = treeRef.value.$el.querySelector(".el-input__inner")
        if (input) {
          ;(input as HTMLElement).focus()
        }
      })
    }
    // @ts-ignore
    const finishEdit = (node, data) => {
      data.edit = false
      // 可以在这里添加保存编辑内容的逻辑
    }

    const getCatalog = async () => {
      // @ts-ignore
      const uuidArray = selectedOptions.value.map((key) => dictionary.value[key])
      const param = {
        content: inputContent.value,
        materialFiles: uuidArray
      }
      const result = await LLMInterfaces.default.PPTCatalog(param)
      // @ts-ignore
      treeData.value = reverseDataObjectToItems(result.data.response)
    }

    const materialChoose = () => {
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
          options.value = tools.map((item) => item.fileName)
          // @ts-ignore
          dictionary.value = tools.reduce((acc, tools) => ({ ...acc, [tools.fileName]: tools.uuid }), {})
          console.log(dictionary.value)
        })
        .catch((error) => {
          console.error("Failed to fetch data:", error)
        })
      dialogVisible.value = true
    }

    const submitContent = () => {
      ElNotification({
        title: "success",
        type: "success",
        dangerouslyUseHTMLString: true,
        message: "<a style='color: teal' target='_blank'>PPT生成中，请稍后。</a>",
        duration: 3000,
        position: "bottom-right"
      })
      // @ts-ignore
      const result = extractDataFromEditableItems(treeData.value)
      const param = {
        content: inputContent.value,
        // @ts-ignore
        materialFiles: selectedOptions.value.map((key) => dictionary.value[key]),
        catalog: result
      }
      LLMInterfaces.default.PPTGenerate(param)
      console.log(result)
      console.log(treeData.value)
      const result1 = reverseDataObjectToItems(result)
      console.log(result1)
      // @ts-ignore
      console.log((treeData.value = result1))
    }

    const handleClose = () => {}

    const dialogConfirm = () => {
      dialogVisible.value = false
    }

    return {
      treeData,
      defaultProps,
      selectedNode,
      treeRef,
      canAddParentNode,
      canAddEditableNode,
      addEditableNode,
      addParentNode,
      removeNode,
      handleNodeClick,
      editNodeLabel,
      finishEdit,
      getCatalog,
      materialChoose,
      submitContent,
      inputContent,
      dialogTitle,
      dialogVisible,
      handleClose,
      selectedOptions,
      options,
      dialogConfirm
    }
  }
})
</script>

<style>
.tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 8px;
}
</style>
