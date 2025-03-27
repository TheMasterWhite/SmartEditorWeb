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

function reverseDataObjectToItems(dataObject: DataObject): ParentItem[] {
  // Helper function to create an EditableItem
  function createEditableItem(fixedLabel: string, editableLabel: string): EditableItem {
    return {
      id: Date.now(),
      type: "editable",
      fixedLabel,
      editableLabel
    }
  }

  // Helper function to create a ParentItem for section content
  function createSectionContentItem(sectionContent: string[]): ParentItem {
    return {
      id: Date.now(),
      type: "parent",
      fixedLabel: "章节内容",
      children: sectionContent.map((content, index) => {
        const pageLabel = `页标签${index + 1}：`
        return createEditableItem(pageLabel, content)
      })
    }
  }

  // Create a ParentItem for the title, subtitle, and reporter
  const titleItem: ParentItem = {
    id: Date.now(),
    type: "parent",
    fixedLabel: "标题信息",
    children: [
      createEditableItem("主标题：", dataObject.主标题),
      createEditableItem("副标题：", dataObject.副标题),
      createEditableItem("汇报人：", dataObject.汇报人)
    ]
  }

  // Create a ParentItem for the content
  const contentItem: ParentItem = {
    id: Date.now(),
    type: "parent",
    fixedLabel: "内容",
    children: dataObject.内容.map((section) => {
      return {
        id: Date.now(),
        type: "parent",
        fixedLabel: "章节标题：",
        children: [createEditableItem("章节标题：", section.章节标题), createSectionContentItem(section.章节内容)]
      }
    })
  }

  // Return the items array with the title and content ParentItems
  return [titleItem, contentItem]
}

// Example usage:
const dataObject: DataObject = {
  主标题: "主标题内容",
  副标题: "副标题内容",
  汇报人: "汇报人名字",
  内容: [
    {
      章节标题: "第一章",
      章节内容: ["页标题1内容", "页标题2内容", "页标题3内容"]
    }
    // ... other sections
  ]
}
export default reverseDataObjectToItems

const reversedItems = reverseDataObjectToItems(dataObject)
console.log(reversedItems)
