import { visit } from 'unist-util-visit'

const parenthesisRegexExclusive = /(?<=\[\[).*?(?=\]\])/g

export default function addDoubleBracketsLinks() {
  return (tree) =>
    visit(tree, 'text', (node, index, parent) => {
      const value = node.value

      if (
        typeof value !== 'string' ||
        !parent ||
        !Array.isArray(parent.children)
      ) {
        return
      }

      const matches = value.match(parenthesisRegexExclusive)

      if (!matches) {
        return
      }

      const children = [value]
      matches.forEach((match) => {
        const last = children.pop()
        if (typeof last !== 'string') {
          return
        }
        const split = `[[${match}]]`
        const [first, ...rest] = last.split(split)
        children.push(first, { id: match }, rest.join(split))
      })

      parent.children.splice(
        index,
        1,
        ...children.map((child) => {
          if (typeof child === 'string') {
            return {
              type: 'text',
              value: child,
            }
          }
          return {
            type: 'link',
            url: child.id,
            title2: `__roam_block_${child.id}`,
            children: [{ type: 'text', value: child.id }],
          }
        })
      )
    })
}
