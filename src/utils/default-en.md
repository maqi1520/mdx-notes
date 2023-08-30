## What Can MDX Do?

It allows us to write JSX in markdown.

Here is a bar chart of precipitation in 2018.

<Chart data={[6, 5, 2, 4.5, 1.5, 2.5, 2, 2.5, 1.5, 2.5, 3.5, 7]} color="#3b82f6"/>

First of all, this is not an image, but rendered using code.

It allows you to focus on content creation without worrying about formatting styles. Once the creation is complete, you can easily copy and paste it into WeChat backend or email editor.

## Implementation

Now let's implement the chart shown above. The Chart component is defined in the config.

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

Write the CSS code for this component on the CSS tab page.

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
  align-items: flex-end;
  font-size: 10px;
  color: #eff6ff;
}
```

Now you can use the `Chart` component for rendering.

```jsx
<Chart
  data={[6, 5, 2, 4.5, 1.5, 2.5, 2, 2.5, 1.5, 2.5, 3.5, 7]}
  color="#3b82f6"
/>
```

Thank you for reading and using this. If you encounter any issues, you can raise them on [Github](https://github.com/maqi1520/mdx-editor). We hope it can be helpful to you.
