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
        >
          <span>{i + 1}月</span>
        </div>
      ))}
    </div>
  )
}

export default {
  Chart,
}
