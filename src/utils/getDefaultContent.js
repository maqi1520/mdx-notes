import postcss from 'postcss'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import defaultContent from 'raw-loader!./index.md'

export async function getDefaultContent() {
  const html = defaultContent
  const css = `/* --- code --- */
.code__card {
  background-color: #1e293b;
  border-radius: 9px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 10%), 0 2px 4px -2px rgb(0 0 0 / 10%);
}

.code__tools {
  display: flex;
  align-items: center;
  padding: 12px;
}
.code__card__content {
  padding: 0 12px 12px 12px;
  font-size: 12px;
  -webkit-overflow-scrolling: touch;
}

.code__circle {
  display: inline-block;
  align-items: center;
  width: 9px;
  height: 9px;
  margin-right: 8px;
  padding: 1px;
  border-radius: 50%;
}
.red {
  background-color: #ff605c;
}

.yellow {
  background-color: #ffbd44;
}

.green {
  background-color: #00ca4e;
}

/*默认样式，最佳实践*/

/*全局属性*/
.markdown-body {
  font-family: Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, "PingFang SC", Cambria,
    Cochin, Georgia, Times, "Times New Roman", serif;
  color: rgb(75 85 99);
  line-height: 1.6;
  word-spacing: 0px;
  letter-spacing: 0px;
  word-break: break-word;
  word-wrap: break-word;
  text-align: left;
}

/*段落*/
.markdown-body p {
  font-size: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
  margin: 0;
  line-height: 26px;
  color: rgb(75 85 99);
}

/*标题*/
.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  margin-top: 30px;
  margin-bottom: 15px;
  padding: 0px;
  font-weight: bold;
  color: rgb(17 24 39);
}
.markdown-body h1 {
  font-size: 24px;
}
.markdown-body h2 {
  font-size: 22px;
}
.markdown-body h3 {
  font-size: 20px;
}
.markdown-body h4 {
  font-size: 18px;
}
.markdown-body h5 {
  font-size: 16px;
}
.markdown-body h6 {
  font-size: 16px;
}

.markdown-body h1 .prefix,
.markdown-body h2 .prefix,
.markdown-body h3 .prefix,
.markdown-body h4 .prefix,
.markdown-body h5 .prefix,
.markdown-body h6 .prefix {
  display: none;
}

.markdown-body h1 .suffix .markdown-body h2 .suffix,
.markdown-body h3 .suffix,
.markdown-body h4 .suffix,
.markdown-body h5 .suffix,
.markdown-body h6 .suffix {
  display: none;
}

/*列表*/
.markdown-body ul,
.markdown-body ol {
  margin-top: 8px;
  margin-bottom: 8px;
  padding-left: 25px;
  color: rgb(75 85 99);
}
.markdown-body ul {
  list-style-type: disc;
}
.markdown-body ul ul {
  list-style-type: square;
}

.markdown-body ol {
  list-style-type: decimal;
}

.markdown-body li section {
  margin-top: 5px;
  margin-bottom: 5px;
  line-height: 26px;
  text-align: left;
  color: rgb(75 85 99);
  font-weight: 500;
}

/*引用*/
.markdown-body blockquote {
  border: none;
}

.markdown-body blockquote {
  display: block;
  font-size: 0.9em;
  overflow: auto;
  overflow-scrolling: touch;
  border-left: 3px solid rgba(0, 0, 0, 0.4);
  background: rgba(0, 0, 0, 0.05);
  color: #6a737d;
  padding: 1px 23px;
  margin: 22px 0;
}

.markdown-body blockquote p {
  margin: 0px;
  color: rgb(75 85 99);
  line-height: 26px;
}

.markdown-body .table-of-contents a {
  border: none;
  color: rgb(75 85 99);
  font-weight: normal;
}

/*链接*/
.markdown-body a,
.markdown-body .link {
  text-decoration: none;
  color: rgb(14 165 233);
  word-wrap: break-word;
  font-weight: bold;
  border-bottom: 1px solid rgb(14 165 233);
}

/*加粗*/
.markdown-body strong {
  font-weight: bold;
  color: rgb(17 24 39);
}

/*斜体*/
.markdown-body em {
  font-style: italic;
  color: rgb(17 24 39);
}

/*加粗斜体*/
.markdown-body em strong {
  font-weight: bold;
  color: rgb(17 24 39);
}

/*删除线*/
.markdown-body del {
  font-style: italic;
  color: rgb(75 85 99);
}

/*分隔线*/
.markdown-body hr {
  height: 1px;
  margin: 0;
  margin-top: 10px;
  margin-bottom: 10px;
  border: none;
  border-top: 1px solid rgb(209 213 219);
}

/*行内代码*/
.markdown-body p code,
.markdown-body li code {
  font-size: 14px;
  word-wrap: break-word;
  padding: 2px 4px;
  border-radius: 4px;
  margin: 0 2px;
  color: rgb(14 165 233);
  background-color: rgb(241 245 249);
  font-family: Operator Mono, Consolas, Monaco, Menlo, monospace;
  word-break: break-all;
}

/*图片*/
.markdown-body img {
  display: block;
  margin: 0 auto;
  max-width: 100%;
}

/*图片*/
.markdown-body figure {
  margin: 0;
  margin-top: 10px;
  margin-bottom: 10px;
}

/*图片描述文字*/
.markdown-body figcaption {
  margin-top: 5px;
  text-align: center;
  color: rgb(100, 116, 139);
  font-size: 14px;
}

/*表格*/
.markdown-body table {
  display: table;
  text-align: left;
}
.markdown-body tbody {
  border: 0;
}

.markdown-body table tr {
  border: 0;
  border-top: 1px solid rgb(209 213 219);
  background-color: white;
}

.markdown-body table tr:nth-child(2n) {
  background-color: rgb(209 213 219);
}

.markdown-body table tr th,
.markdown-body table tr td {
  font-size: 16px;
  border: 1px solid rgb(209 213 219);
  padding: 5px 10px;
  text-align: left;
}

.markdown-body table tr th {
  color: rgb(51 65 85);
  font-weight: bold;
  background-color: rgb(241 245 249);
}

/* 表格最小列宽4个汉字 */
.markdown-body table tr th:nth-of-type(n),
.markdown-body table tr td:nth-of-type(n) {
  min-width: 85px;
}

.markdown-body sub,
sup {
  line-height: 0;
}

.markdown-body .footnote-ref {
  color: rgb(14 165 233);
  font-size: 75%;
  position: relative;
  top: -4px;
  left: 2px;
  font-weight: bold;
}

.markdown-body .footnote-item {
  display: flex;
  font-size: 14px;
}

.markdown-body .footnote-num {
  display: inline;
  width: 10%; /*神奇，50px就不可以*/
  background: none;
  font-size: 80%;
  opacity: 0.6;
  line-height: 26px;
  font-family: ptima-Regular, Optima, PingFangSC-light, PingFangTC-light, "PingFang SC", Cambria,
    Cochin, Georgia, Times, "Times New Roman", serif;
}

.markdown-body .footnote-item .footnote-content {
  display: inline;
  font-size: 14px;
  width: 90%;
  padding: 0px;
  margin: 0;
  line-height: 26px;
  color: rgb(75 85 99);
  word-break: break-all;
}
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
  color:rgb(14 165 233);
}
`
  const config = `function List({ children, title }) {
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
}`

  // let { css: compiledCss } = await postcss([
  //   tailwindcss({
  //     content: [{ raw: html }],
  //   }),
  //   autoprefixer(),
  //   cssnano(),
  // ]).process(css, {
  //   from: undefined,
  // })

  return {
    html,
    css,
    config,
    // compiledCss,
  }
}
