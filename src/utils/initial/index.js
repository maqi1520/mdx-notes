import defaultContent from 'raw-loader!./default.md'
import defaultENContent from 'raw-loader!./default-en.md'
import mathExample from 'raw-loader!./math-theme-demo.mdx'
import PPT from 'raw-loader!./PPT.md'
import js from '!!raw-loader!./custom.js'
import css from '!!raw-loader!./custom.css'
import mathjs from "!!raw-loader!./math.js"
import mathcss from "!!raw-loader!./math.css"
export default {
  'MDX Notes 介绍.md': defaultContent,
  'Introduction to MDX Notes.md': defaultENContent,
  'Math Theme Example.md': mathExample,
  'PPT.md': PPT,
  'plugins/themes/custom.js': js,
  'plugins/themes/custom.css': css,
  'plugins/themes/math.css': mathcss,
  'plugins/themes/math.js': mathjs,
}
