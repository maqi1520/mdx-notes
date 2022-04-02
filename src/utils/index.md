# 微信排版工具新选择

<div style={{width:200, margin:'0 auto'}}>  
![MDX Editor](https://editor.runjs.cool/img/logo.svg)
</div>
> 一个好用的排版编辑器
## 目录

## 前言

哈喽，大家好，我是小马，去年年底，我开通了微信公众号“JS 酷”，也开始陆陆续续写文章，
发到微信公众号，作为一名程序员，我酷爱 Markdown，相信很多朋友跟我一样，
也经常会有写技术文档的需求。Markdown 由于语法简洁、使用方便、深受广大程序员们的喜爱。

## 使用 Markdown 的痛点

Markdown 适合写技术文档，但 Markdown 已不再适合当下的写作场景了，就拿微信文章来说，
微信后台使用的是 UEditor， 也就是 HTML 编辑器，我之前的做法是：先在我的博客写文章，
然后拷贝到 [mdnice](https://www.mdnice.com/)，让 mdnice 帮助我排版，然后一键拷贝 html 到微信后台。
此时，如果我想在文章页面加一个好看一点的样式，比如“往期推荐”， markdown 就满足不了我的需求，
然后我需要安装壹伴小插件，来用这个来帮助我添加一个好看的样式。然而壹伴小插件部分功能是收费的，为了白嫖，我还写了一个
油猴脚本，详情可以看这篇文章。

- [《这个油猴脚本也许对你微信排版有帮助》](https://mp.weixin.qq.com/s?__biz=Mzg4MTcyNDY4OQ==&mid=2247485722&idx=1&sn=6dc98a887abd70ea3e56672acfbf56c2&chksm=cf60d564f8175c7205675b30d6a4ac985e027859ae4be219af0f3338e9cf24ae7df81a7d06a4&=1395277972&=zh_CN#rd)

接下来问题就来了，如果我的文章有一个地方修改，我就要先修改博客，
然后再切换到 [mdnice](https://www.mdnice.com/) 最后再切换回微信后台，
这样来回切换，然后之前编辑好的往期推荐又得重新编辑。。。

## 实现一个编辑器

为了弥补 markdown 的缺点，我使用 mdx 来实现编辑器的功能，
mdx 也就是 markdown 语法和 JSX 的结合，关于 MDX 的优势大家可以看下这篇文章

- [《MDX 让 Markdown 步入组件时代》](https://juejin.cn/post/7068457189559500836 '《MDX 让 Markdown 步入组件时代》')

其实最简易的 demo 也是来自于官网的 [playground](https://mdxjs.com/playground/)

![MDX playground](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/16bafa48eed84d429227aa6f13d71ebf~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

## 功能介绍

下面介绍下 mdx editor 的功能

- 生成微信外链脚注

```md
[《MDX 让 Markdown 步入组件时代》](https://juejin.cn/post/7068457189559500836 '《MDX 让 Markdown 步入组件时代》')
```

针对非微信文章`a`链接会转成`span`标签，但也不是对所有外链生成脚注，
因为文章中有时候链接会重复，所以可以给外链添加`title`属性。

- 生成文章目录

```md
## 目录
```

针对较长的文章，添加二级标题目录就会自动生成目录。

- 右键文档格式化

markdown 写作也需要格式化，比如中文和数字之间自动加空格,也可以使用快捷键 `command + S`

- 自定义组件和样式

目前编辑器没有多皮肤功能，大家可以切换到 `CSS` tab 下自己修改样式，也可以在 `Config` tab 下实现自己的组件，
比如内置了一个 List 组件

```jsx
function List({ children, title }) {
  return (
    <div className="list">
      <div className="list-head">
        <div className="list-head-line"></div>
        <div className="list-head-line"></div>
      </div>
      <div className="list-title">{title}</div>
      <div>{children}</div>
    </div>
  )
}

export default {
  List,
}
```

下面是 List 组件的内置 css 代码

```css
.list {
  margin: 0 auto;
  margin-top: 30px;
  margin-bottom: 15px;
  max-width: 320px;
  background: #ffffff;
  border: 1px solid #94cff7;
  opacity: 1;
  border-radius: 6px;
  padding: 5.5px;
}
.list-head {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-top: -15px;
  margin-bottom: -3px;
}
.list-head-line {
  width: 7px;
  height: 17px;
  background: #ffffff;
  border: 1px solid rgb(14 165 233);
  opacity: 1;
  border-radius: 77px;
}
.list-title {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgb(14 165 233);
  border-radius: 6px;
  text-align: center;
  color: #fff;
  font-size: 15px;
}
.markdown-body .list ul {
  display: flex;
  flex-direction: column;
  min-height: 40px;
  padding: 15px 10px 0 30px;
  list-style: circle;
  justify-content: space-between;
  align-items: flex-start;
}
.markdown-body .list ul li a {
  border-bottom: 0;
}
.list ul li {
  font-size: 14px;
  margin-bottom: 15px;
  color: rgb(14 165 233);
}
```

在 MDX 中使用

```md
<List title="往期推荐">
- [《如何使用 react 和 three.js在网站渲染自己的3D模型》](https://juejin.cn/post/7073065656580571173)
- [《初步尝试 tauri，并且与electron.js对比》](https://juejin.cn/post/7059400669916037133) 
- [《React 新的文档用到了哪些技术？》](https://juejin.cn/post/7052646487632642084)
- [《使用 react-pdf 打造在线简历生成器》](https://juejin.cn/post/7067108714355884069)
</List>
```

![往期推荐效果](http://img.maqib.cn/img/20220328120045.png)

- 数据存储

MDX Editor 不会存储数据，只使用`localStorage`存储到本地，
如你想分享你的文章，可以点击左上角的分享按钮，同时文章将存储到云数据库中，这样就可以通过链接分享了。当然为了文章数据不丢失，建议下载 MDX 存储在本地。

mdx 的功能远不止于此，甚至我们可以根据它写一个[简历模板](https://editor.runjs.cool/624688ccb6fe2900015728ac)，然后我们就可以使用 markdown 来排版简历了！

## 开源

目前代码已经开源在我的 github，点击右上角链接直达！

若这个小工具对你有帮助，欢迎点个 star 。

当然目前版本功能还不是很完善，更多功能还在开发中。

如果还有什么疑问或者建议，可以关注我的微信公众号“JS 酷”留言， 也可以加我微信交流。
