<h4 align="right"><a href="https://github.com/maqi1520/mdx-editor/blob/main/README_EN.md">English</a> | <strong>简体中文</strong></h4>

<div align="center">
<a href="https://editor.runjs.cool/">
<img width="500" src="./public/social-card.jpg"/>
</a>
</div>
<div align="center"> <a href="https://github.com/maqi1520/mdx-editor/actions">
    <img src="https://github.com/maqi1520/mdx-editor/actions/workflows/release.yml/badge.svg" alt="">
  </a>
  <a href="https://github.com/maqi1520/mdx-editor/releases">
    <img src="https://img.shields.io/github/downloads/maqi1520/mdx-editor/total.svg" alt="">
  </a>
  <a href="https://github.com/maqi1520/mdx-editor/releases/latest">
    <img src="https://img.shields.io/github/release/maqi1520/mdx-editor.svg" alt="">
  </a>
</div>
<h1 align="center">MDX Editor</h1>

> 一个好用的微信排版编辑器，更是一个跨平台 Markdown 笔记软件

## 灵感

Markdown 是广大程序员酷爱的写作方式，但满足不了微信排版的需求，MDX 正好弥补了 Markdown 的缺陷。我的博客正好也是使用 MDX 来书写的，如何做到一次书写，排版统一？ 当我看到 [mdxjs playground](https://mdxjs.com/playground/) 的时候，我就在思考能否实现类似的方案？

## 功能

### 网页版

[在线体验](https://editor.runjs.cool/)

- 支持一键复制到微信公众号
- 支持自定义样式组件，自定义样式，生成二维码、代码 diff 高亮，
- 支持生成文章目录
- 支持生成微信脚注
- 自动转换微信外链为`span`
- 支持代码格式化
- 支持文章分享
- 支持下载 markdown
- 支持导出 pdf

### 桌面版

[下载地址](https://github.com/maqi1520/mdx-editor/releases)

桌面版除了网页版的功能之外，还支持

- 支持本地文件实时保存
- 支持本地文件目录树管理
- 支持导出 HTML

## 模板效果

<table>
<tr>
    <td><img src="https://user-images.githubusercontent.com/9312044/262275142-ce7f3e70-cbad-449e-999e-4cba33f75000.png"/></td>
    <td><img src="https://user-images.githubusercontent.com/9312044/262275149-3310abc1-5a6d-45cb-aa9a-3359381ec429.png"/></td>
</tr> 
<tr>
    <td><a href="https://editor.runjs.cool/64b51328337a9f4db79fe677" >浅绿色卡片</a></td>
    <td><a href="https://editor.runjs.cool/64c0fca121821b2af589cf6e">初夏风格</a></td>
</tr> 
<tr>
  <td><img src="https://user-images.githubusercontent.com/9312044/262275160-41c30692-b554-4da6-bcc7-3fb00169ed5d.png"/></td>
  <td><img src="https://user-images.githubusercontent.com/9312044/262275117-fdf35fe4-0b70-45ad-995d-b6622586c6d8.png"/></td>
</tr>
<tr>
  <td><a href="https://editor.runjs.cool/624688ccb6fe2900015728ac">简历模板</a></td>
  <td><a href="https://editor.runjs.cool/625550658cc5730001809f0c">代码 diff 高亮</a></td>
</tr>
<tr>
    <td><img src="https://user-images.githubusercontent.com/9312044/262275165-766ff817-7c09-4288-b8dd-55d7424c2fd6.png"/></td>
    <td><img src="https://user-images.githubusercontent.com/9312044/262275168-6dd4b05c-a604-4ab1-abe3-b2d2dc759d8e.png"/></td>
</tr> 
<tr>
    <td><a href="https://editor.runjs.cool/6492ae0109e298c79055dfab">生成二维码</a></td>
    <td><a href="https://editor.runjs.cool/6492aa37f5cf3a54f14493a8">旅行计划</a></td>
</tr> 
</table>

## 开发

网页版在 `main` 分支

```bash
yarn
yarn dev
```

桌面版在 `tauri-app` 分支

```bash
yarn
yarn tauri dev
```

## 赞助作者

<table>
<tr>
<td>支付宝</td>
<td>微信</td>
</tr>
<tr>
<td>
<img src="https://github.com/maqi1520/mdx-editor/assets/9312044/603e1826-4be7-49de-a65d-c415b52e434b" width="180" alt="支付宝赞赏码">
</td>
<td>
<img src="https://github.com/maqi1520/mdx-editor/assets/9312044/047b369a-0458-48bd-96a1-64dd2c06a6bd" width="190" alt="微信赞赏码"></td>
</tr>
</table>

## FAQ

### 1. macOS 系统安装完后显示「文件已损坏」或者安装完打开没有反应

因为 MDX Editor 没有签名，所以会被 macOS 的安全检查所拦下。

1. 安装后打开遇到「文件已损坏」的情况，请按如下方式操作：

信任开发者，会要求输入密码:

```bash
sudo spctl --master-disable
```

然后放行 MDX Editor :

```bash
xattr -cr /Applications/MDX\ Editor.app
```

然后就能正常打开。

如果提示以下内容

```sh
option -r not recognized

usage: xattr [-slz] file [file ...]
       xattr -p [-slz] attr_name file [file ...]
       xattr -w [-sz] attr_name attr_value file [file ...]
       xattr -d [-s] attr_name file [file ...]
       xattr -c [-s] file [file ...]

The first form lists the names of all xattrs on the given file(s).
The second form (-p) prints the value of the xattr attr_name.
The third form (-w) sets the value of the xattr attr_name to attr_value.
The fourth form (-d) deletes the xattr attr_name.
The fifth form (-c) deletes (clears) all xattrs.

options:
  -h: print this help
  -s: act on symbolic links themselves rather than their targets
  -l: print long format (attr_name: attr_value)
  -z: compress or decompress (if compressed) attribute value in zip format
```

执行命令

```bash
xattr -c /Applications/MDX\ Editor.app/*
```

如果上述命令依然没有效果，可以尝试下面的命令：

```bash
sudo xattr -d com.apple.quarantine /Applications/MDX\ Editor.app/
```

## 部署

[Vercel Platform](https://vercel.com/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

## 参考

- [mdxjs playground](https://mdxjs.com/playground/)
- [play.tailwindcss.com](https://play.tailwindcss.com/)
- [mdnice.com](https://mdnice.com/)
