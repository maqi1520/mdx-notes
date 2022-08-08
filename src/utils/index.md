## MDX 能干什么？

它能够让我们在 markdown 中写 JSX

这是 2018 年，降水量柱状图。

<Chart data={[6, 5, 2, 4.5, 1.5, 2.5, 2, 2.5, 1.5, 2.5, 3.5, 7]} color="#3b82f6"/>

首先这不是一张图片，而是用代码渲染的。

我看到很多公司的微信推文，很多地方都是用图片排版的，有很多设计师把大量的时间花了在文案和设计稿的校对上，我正借助了 MDX 的优势，开发了 MDX Editor，来互补微信排版的不足，只需要将文章写成 markdown 格式，便可以一键拷贝到微信公众号后台。

## 实现

Chart 这个组件定义在 config 中

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

再加点 css

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
  align-items: end;
  font-size: 10px;
  color: #eff6ff;
}
```

感谢你的阅读和使用，若遇到问题，可以在 github 提 issues，也可以关注微信公众号 “JS 酷”留言反馈，希望更够帮助到您。
