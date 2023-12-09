import React from 'react'
import dynamic from 'next/dynamic'
const Editor = dynamic(() => import('../components/Tiptap'), {
  ssr: false,
})

const defaultValue = `## 标题二
---

[123](https://stackblitz.com/edit/stackblitz-starters-aurlug?file=src%2FApp.tsx)

![](https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png)

~~~css
body{ color:red}
~~~


\`\`\`html
<p>
  But a recent study shows that the celebrated appetizer may be linked to a series of rabies cases
  springing up around the country.
</p>
\`\`\`

For more information about how to use the plugin and the features it includes, [read the documentation](https://github.com/tailwindcss/typography/blob/master/README.md).

---

## This is a heading

1. We want everything to look good out of the box.
2. Really just the first reason, that's the whole point of the plugin.
3. Here's a third pretend reason though a list with three items looks more realistic than a list with two items.

Now **I'm going to show you** an example of an unordered list to make sure that looks good, too:

- So here is the first item in this list.
- In this example we're keeping the items short.
- Later, we'll use longer, more complex list items.

Let's even style a table:

| Wrestler                | Origin       | Finisher           |
| ----------------------- | ------------ | ------------------ |
| Bret "The Hitman" Hart  | Calgary, AB  | Sharpshooter       |
| Stone Cold Steve Austin | Austin, TX   | Stone Cold Stunner |
| Randy Savage            | Sarasota, FL | Elbow Drop         |
| Vader                   | Boulder, CO  | Vader Bomb         |
| Razor Ramon             | Chuluota, FL | Razor's Edge       |

Finally, a figure with a caption:
`

export default function editor() {
  const handleChange = () => {}
  return <Editor defaultValue={defaultValue} onChange={handleChange} />
}
