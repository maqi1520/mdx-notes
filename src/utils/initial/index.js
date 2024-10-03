import defaultContent from 'raw-loader!./default.md'
import defaultENContent from 'raw-loader!./default-en.md'
import PPT from 'raw-loader!./PPT.md'
import js from '!!raw-loader!./custom.js'
import css from '!!raw-loader!./custom.css'

export default {
  'MDX Notes 介绍.md': defaultContent,
  'Introduction to MDX Notes.md': defaultENContent,
  'PPT.md': PPT,
  'plugins/themes/custom.js': js,
  'plugins/themes/custom.css': css,
}
