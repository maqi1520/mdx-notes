export interface CompileResult {
  md: string
  markdownTheme: string
  jsx: string
  frontMatter: {}
  css: string
  html: string
  codeTheme: string
}

export interface FileNode {
  name: string
  path: string
  is_file: boolean
  is_directory: boolean
  children?: FileNode[] | null
}

export interface SearchResultItem {
  name: string
  path: string
  match_lines: string[]
}

export interface MenuItemProps {
  name: string
  extra?: string
  event: () => void
}

export interface TocItem {
  line: number
  value: string
  depth: number
}
