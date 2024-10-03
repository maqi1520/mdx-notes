---
title: What Can MDX Do?
theme: custom
---

## MDX 能干什么？

它能够让我们在 markdown 中写 JSX

这是 2018 年，降水量柱状图。

<Chart data={[6, 5, 2, 4.5, 1.5, 2.5, 2, 2.5, 1.5, 2.5, 3.5, 7]} color="#3b82f6"/>

首先这不是一张图片，而是用代码渲染的。

它可以让你专注于内容创作，而不必关心排版样式，创作完成后你可以一键复制到微信后台或者邮箱编辑器

## 实现

现在我们来实现一下上面这张图表，Chart 这个组件定义在 config 中

```jsx
function Chart({ data = [], color }) {
  return (
    <div className="snowfall">
      {data.map((d, i) => (
        <div
          key={i}
          className="snowfall-bar"
          style={{
            height: d * 20,
            backgroundColor: color,
          }}
        />
      ))}
    </div>
  )
}
```

在 CSS Tab 页面写上这个组件的 CSS 代码

```css
.snowfall {
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.snowfall-bar {
  flex-basis: 0;
  flex-grow: 1;
  margin: 4px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  font-size: 10px;
  color: #eff6ff;
}
```

这样就可以使用 `Chart` 这个组件来渲染了

```jsx
<Chart
  data={[6, 5, 2, 4.5, 1.5, 2.5, 2, 2.5, 1.5, 2.5, 3.5, 7]}
  color="#3b82f6"
/>
```

感谢你的阅读和使用，若遇到问题，可以在 [Github](https://github.com/maqi1520/mdx-notes) 提 issues，也可以关注微信公众号 “JS 酷”留言反馈，希望更够帮助到您。
