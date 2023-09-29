---
background: https://images.unsplash.com/photo-1568983268695-74a04650c8b3?auto=format&fit=crop&w=1512&q=80
layout: cover
class: text-white
title: Markdown 实现写 PPT
---

# Markdown 实现写 PPT

在线幻灯片演示

---
layout: image-right
image: https://images.unsplash.com/photo-1662581871625-7dbd3ac1ca18?auto=format&fit=crop&w=756&q=80
---

## 灵感来自 slidev

- [slidev](https://sli.dev/)

- 通过 `---` 添加分隔符来分隔你的幻灯片。

---

## 通过添加(front matter)，为每张幻灯片指定布局

- center

内容在屏幕中间显示

- cover

用于显示演示文稿的封面，可能包含演示文稿标题、上下文等。

- default

最基本的布局，可以显示任何类型的内容。

- end

底部对齐

- image-left

左右布局，左边是图片


- image-right

左右布局，右边是图片

---
layout: center
background: https://images.unsplash.com/photo-1662581871625-7dbd3ac1ca18?auto=format&fit=crop&w=1512&q=80
class: text-white
---

# Center 居中布局

nihao 

---

## 代码高亮

```js showLineNumbers {3,5}
const layout = {
  default: DefaultSlideItem,
  'image-right': ImageRight,
}
function App() {
  return (
    <div className="app">
      {slides.map((item, index) => {
        const Slide = layout[item.data.layout || 'default']
        return <Slide item={item} key={index} />
      })}
    </div>
  )
}
```

---
layout: end
background: https://images.unsplash.com/photo-1579532649051-ed5208863cd9?auto=format&fit=crop&w=1512&q=80
class: text-white
---

# 雏形完成

感谢你观看，帮我点赞，对我真的很重要！！！
