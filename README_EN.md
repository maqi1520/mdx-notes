<h4 align="right"><strong>English</strong> | <a href="https://github.com/maqi1520/mdx-editor/blob/main/README_EN.md">简体中文</a></h4>

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

> A versatile WeChat typesetting editor, also serving as a cross-platform Markdown note-taking software.

## Inspiration

Markdown, beloved by countless programmers as a writing format, falls short in meeting the typesetting demands of WeChat. Fortunately, MDX comes to the rescue, mending Markdown's inadequacies. As my own blog utilizes MDX for writing, I pondered upon the possibility of achieving a unified solution for writing and typesetting when I stumbled upon the [mdxjs playground](https://mdxjs.com/playground/).

## Features

### Web Version

- Seamlessly copy to WeChat Official Accounts with just a click
- Customize styled components and styles, generate QR codes and code diff highlights
- Generate article indexes effortlessly
- Create WeChat footnotes with ease
- Automatically convert WeChat external links into `span` elements
- Ensure code formatting precision
- Facilitate article sharing with built-in functionality
- Download markdown files effortlessly
- Export to PDF seamlessly

### Desktop Version

In addition to the web version's features, the desktop version includes:

- Real-time local file saving
- Efficient management of local file directories
- Hassle-free HTML export functionality

## Template Examples

<table>
<tr>
    <td><img src="https://user-images.githubusercontent.com/9312044/262275142-ce7f3e70-cbad-449e-999e-4cba33f75000.png"/></td>
    <td><img src="https://user-images.githubusercontent.com/9312044/262275149-3310abc1-5a6d-45cb-aa9a-3359381ec429.png"/></td>
</tr> 
<tr>
    <td><a href="https://editor.runjs.cool/64b51328337a9f4db79fe677" >Subtle Green Card</a></td>
    <td><a href="https://editor.runjs.cool/64c0fca121821b2af589cf6e">Early Summer Style</a></td>
</tr> 
<tr>
  <td><img src="https://user-images.githubusercontent.com/9312044/262275160-41c30692-b554-4da6-bcc7-3fb00169ed5d.png"/></td>
  <td><img src="https://user-images.githubusercontent.com/9312044/262275117-fdf35fe4-0b70-45ad-995d-b6622586c6d8.png"/></td>
</tr>
<tr>
  <td><a href="https://editor.runjs.cool/624688ccb6fe2900015728ac">Resume Template</a></td>
  <td><a href="https://editor.runjs.cool/625550658cc5730001809f0c">Exquisite Code Diff Highlights</a></td>
</tr>
<tr>
    <td><img src="https://user-images.githubusercontent.com/9312044/262275165-766ff817-7c09-4288-b8dd-55d7424c2fd6.png"/></td>
    <td><img src="https://user-images.githubusercontent.com/9312044/262275168-6dd4b05c-a604-4ab1-abe3-b2d2dc759d8e.png"/></td>
</tr> 
<tr>
    <td><a href="https://editor.runjs.cool/6492ae0109e298c79055dfab">Generate Captivating QR Codes</a></td>
    <td><a href="https://editor.runjs.cool/6492aa37f5cf3a54f14493a8">Travel Itinerary</a></td>
</tr> 
</table>

## Development

To access the web version, switch to the `main` branch and follow these commands:

```bash
yarn
yarn dev
```

For the desktop version, switch to the `tauri-app` branch and execute the following commands:

```bash
yarn
yarn tauri dev
```

## Sponsor

[Buy me a coffee](https://www.buymeacoffee.com/maqi1520)

Please give it a star ⭐ ☝️ if it's helpful to you.

## FAQ

### 1. After installing on macOS, it shows "The file is damaged" or there is no response when opening it

Because MDX Editor is not signed, it is blocked by macOS security checks.

If you encounter the "The file is damaged" error after installation, follow these steps:

Trust the developer, and it will prompt you to enter your password:

```bash
sudo spctl --master-disable
```

Then allow MDX Editor:

```bash
xattr -cr /Applications/MDX\ Editor.app
```

After that, you should be able to open it normally.

If you see the following message:

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

Execute the command:

```bash
xattr -c /Applications/MDX\ Editor.app/*
```

If the above command still doesn't work, you can try the following command:

```bash
sudo xattr -d com.apple.quarantine /Applications/MDX\ Editor.app/
```

## Deploy

Deployed using the [Vercel Platform](https://vercel.com/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

## References

- [mdxjs playground](https://mdxjs.com/playground/)
- [play.tailwindcss.com](https://play.tailwindcss.com/)
- [mdnice.com](https://mdnice.com/)
