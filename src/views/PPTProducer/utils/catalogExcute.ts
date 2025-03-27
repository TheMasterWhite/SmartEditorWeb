type EditableItem = {
  id: number
  type: "editable"
  fixedLabel: string
  editableLabel: string
}

type ParentItem = {
  id: number
  type: "parent"
  fixedLabel: string
  children: (EditableItem | ParentItem)[]
}

type DataObject = {
  主标题: string
  副标题: string
  汇报人: string
  内容: {
    章节标题: string
    章节内容: string[]
  }[]
}

function extractDataFromEditableItems(items: ParentItem[]): DataObject {
  const dataObject: DataObject = {
    主标题: "",
    副标题: "",
    汇报人: "",
    内容: []
  }

  function processChildren(children: (EditableItem | ParentItem)[]) {
    children.forEach((child) => {
      if (child.type === "editable") {
        switch (child.fixedLabel) {
          case "主标题：":
            dataObject.主标题 = child.editableLabel
            break
          case "副标题：":
            dataObject.副标题 = child.editableLabel
            break
          case "汇报人：":
            dataObject.汇报人 = child.editableLabel
            break
          case "章节标题：":
            dataObject.内容.push({ 章节标题: child.editableLabel, 章节内容: [] })
            break
          case "页标签1：":
          case "页标签2：":
          case "页标签3：":
            if (dataObject.内容.length > 0) {
              dataObject.内容[dataObject.内容.length - 1].章节内容.push(child.editableLabel)
            }
            break
        }
      } else if (child.type === "parent") {
        processChildren(child.children)
      }
    })
  }

  processChildren(items)

  return dataObject
}

// 示例数据，你可以用你的实际数据替换它
const items: ParentItem[] = [
  {
    id: 1,
    type: "parent",
    fixedLabel: "基本信息",
    children: [
      { id: 11, type: "editable", fixedLabel: "主标题：", editableLabel: "这是主标题" },
      { id: 12, type: "editable", fixedLabel: "副标题：", editableLabel: "这是副标题" },
      { id: 13, type: "editable", fixedLabel: "汇报人：", editableLabel: "智澜文心" }
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
          { id: Date.now(), type: "editable", fixedLabel: "章节标题：", editableLabel: "第一章" },
          {
            id: Date.now(),
            type: "parent",
            fixedLabel: "章节内容",
            children: [
              { id: Date.now(), type: "editable", fixedLabel: "页标签1：", editableLabel: "页标题1" },
              { id: Date.now(), type: "editable", fixedLabel: "页标签2：", editableLabel: "页标题2" },
              { id: Date.now(), type: "editable", fixedLabel: "页标签3：", editableLabel: "页标题3" }
            ]
          }
        ]
      },
      {
        id: Date.now(),
        type: "parent",
        fixedLabel: "章节",
        children: [
          { id: Date.now(), type: "editable", fixedLabel: "章节标题：", editableLabel: "第二章" },
          {
            id: Date.now(),
            type: "parent",
            fixedLabel: "章节内容",
            children: [
              { id: Date.now(), type: "editable", fixedLabel: "页标签1：", editableLabel: "页标题1" },
              { id: Date.now(), type: "editable", fixedLabel: "页标签2：", editableLabel: "页标题2" },
              { id: Date.now(), type: "editable", fixedLabel: "页标签3：", editableLabel: "页标题3" }
            ]
          }
        ]
      }
    ]
  }
]

export default extractDataFromEditableItems

// 使用 extractDataFromEditableItems 函数处理示例数据
const dataObject = extractDataFromEditableItems(items)

// 输出生成的 DataObject 对象
console.log(dataObject)
