// 使用闭包函数管理全局序号
const createMathCounter = (() => {
  let counter = 0

  return {
    getNext: () => ++counter,
    reset: () => {
      counter = 0
      return 0
    },
    getCurrent: () => counter,
  }
})()

// 高阶组件工厂 - 生成数学环境组件
function createMathEnvironment(config) {
  const MathEnvironmentComponent = function ({ title, children }) {
    // 获取序号（如果需要）
    const number = config.numbered ? createMathCounter.getNext() : null

    // 主容器样式 - 手机优化紧凑版
    const containerStyle = {
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.25)',
      borderRadius: '6px',
      margin: '6px 0',
      overflow: 'hidden',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
      position: 'relative',
    }

    // 标题区域样式 - 深色背景白字，手机优化紧凑
    const headerStyle = {
      background: `linear-gradient(135deg, ${config.color}, ${config.color}dd)`,
      color: 'white',
      padding: '2px 10px',
      fontSize: '0.8rem',
      fontWeight: '600',
      borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
    }

    // 内容区域样式 - 浅色背景黑字，手机优化紧凑
    const contentStyle = {
      // background: 'rgba(255, 255, 255, 0.95)',
      // color: '#1d1d1f',
      padding: '2px 10px',
      fontSize: '0.85rem',
      lineHeight: '1.5',
    }

    // 构建标题文本
    const titleText = number ? `${config.label} ${number} ${title || ''}` : title || config.label

    return (
      <div style={containerStyle}>
        <div style={headerStyle}>{titleText}</div>
        <div style={contentStyle}>{children}</div>
        {config.showProofEnd && (
          <div
            style={{
              textAlign: 'right',
              marginTop: '8px',
              color: config.color,
              fontSize: '0.9rem',
              fontWeight: '600',
            }}
          ></div>
        )}
      </div>
    )
  }
  
  MathEnvironmentComponent.displayName = `MathEnvironment_${config.label || 'Default'}`
  return MathEnvironmentComponent
}

// 数学环境配置
const mathConfigs = {
  theorem: {
    label: '定理',
    color: '#007AFF',
    numbered: true,
  },
  lemma: {
    label: '引理',
    color: '#FF9500',
    numbered: true,
  },
  corollary: {
    label: '推论',
    color: '#FF3B30',
    numbered: true,
  },
  proof: {
    label: '证明',
    color: '#5856D6',
    numbered: false,
    showProofEnd: true,
  },
  solution: {
    label: '解答',
    color: '#34C759',
    numbered: false,
  },
  exercise: {
    label: '练习',
    color: '#AF52DE',
    numbered: true,
  },
  exmaple: {
    label: '例题',
    color: '#0e7a3e',
    numbered: true,
  },
}

// 使用高阶组件生成数学环境
const Theorem = createMathEnvironment(mathConfigs.theorem)
const Lemma = createMathEnvironment(mathConfigs.lemma)
const Corollary = createMathEnvironment(mathConfigs.corollary)
const Proof = createMathEnvironment(mathConfigs.proof)
const Solution = createMathEnvironment(mathConfigs.solution)
const Exercise = createMathEnvironment(mathConfigs.exercise)
const Example = createMathEnvironment(mathConfigs.exmaple)
// 练习单项组件 - 手机优化紧凑版
function ExerciseItem({ children, bold }) {
  const itemStyle = {
    margin: '6px 0',
    padding: '8px 10px',
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    borderRadius: '6px',
    fontSize: '0.85rem',
    color: '#1d1d1f',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
    lineHeight: '1.4',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  }

  return <div style={itemStyle}>{bold ? <strong>{children}</strong> : children}</div>
}

// 数学公式内联组件 - 手机优化
function MathInline({ children }) {
  const style = {
    background: 'rgba(0, 122, 255, 0.15)',
    backdropFilter: 'blur(8px)',
    padding: '2px 6px',
    borderRadius: '4px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
    color: '#007AFF',
    fontSize: '0.85rem',
    border: '1px solid rgba(0, 122, 255, 0.25)',
    fontWeight: '500',
  }

  return <span style={style}>{children}</span>
}

// 数学公式块组件 - 手机优化紧凑版
function MathBlock({ children }) {
  const style = {
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '6px',
    padding: '8px',
    margin: '6px 0',
    textAlign: 'center',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
    color: '#1d1d1f',
    fontSize: '0.85rem',
    lineHeight: '1.5',
  }

  return <div style={style}>{children}</div>
}

// 数学定义组件 - 手机优化紧凑版
function Definition({ children }) {
  const style = {
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(0, 122, 255, 0.25)',
    borderRadius: '6px',
    padding: '6px 8px',
    margin: '6px 0',
    color: '#1d1d1f',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
    fontSize: '0.8rem',
    lineHeight: '1.4',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  }

  const prefixStyle = {
    fontWeight: '600',
    color: '#007AFF',
    marginRight: '6px',
  }

  return (
    <div style={style}>
      <span style={prefixStyle}>定义：</span>
      {children}
    </div>
  )
}

// 重要公式框组件 - 手机优化紧凑版
function FormulaBox({ title, children }) {
  const boxStyle = {
    border: '3px solid #007AFF',
    borderRadius: '8px',
    padding: '10px',
    margin: '10px 0',
    textAlign: 'left',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
    fontSize: '0.9rem',
    lineHeight: '1.6',
  }

  return <div style={boxStyle}>{children}</div>
}

// 解题步骤组件 - 手机优化
function MathSteps({ children }) {
  const style = {
    listStyle: 'none',
    padding: 0,
    margin: '10px 0',
  }

  return <ol style={style}>{children}</ol>
}

// 步骤项组件 - 手机优化紧凑版
function Step({ children }) {
  const style = {
    margin: '6px 0',
    padding: '8px 10px',
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    borderRadius: '6px',
    fontSize: '0.8rem',
    lineHeight: '1.4',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
    display: 'flex',
    alignItems: 'center',
  }

  const numberStyle = {
    background: '#007AFF',
    color: 'white',
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.7rem',
    fontWeight: '600',
    marginRight: '8px',
    flexShrink: 0,
  }

  return (
    <li style={style}>
      <div style={numberStyle}>•</div>
      <div>{children}</div>
    </li>
  )
}

// 组合练习组件
function ExerciseSet({ title, items = [] }) {
  return (
    <Exercise title={title}>
      {items.map((item, index) => (
        <ExerciseItem key={index} bold={item.bold}>
          {item.content}
        </ExerciseItem>
      ))}
    </Exercise>
  )
}

// 数学图表组件 - 手机优化紧凑版
function MathChart({ data = [], color = '#007AFF' }) {
  const containerStyle = {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    borderRadius: '8px',
    padding: '10px',
    margin: '10px 0',
    textAlign: 'center',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
  }

  const chartStyle = {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: '4px',
    height: '100px',
    padding: '8px 0',
  }

  return (
    <div style={containerStyle}>
      <div style={chartStyle}>
        {data.map((value, index) => (
          <div
            key={index}
            style={{
              minWidth: '28px',
              height: `${value * 16}px`,
              backgroundColor: color,
              borderRadius: '4px 4px 0 0',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                marginTop: '4px',
                fontSize: '0.8rem',
                color: '#6b7280',
              }}
            >
              {index + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// 问答组件 - 手机优化紧凑版，一律显示答案，支持JSX children
function QA({ question, answer, children, showAnswer = false, id }) {
  const qaStyle = {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    borderRadius: '8px',
    padding: '10px',
    margin: '10px 0',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
  }

  const answerStyle = {
    marginTop: '8px',
    padding: '8px',
    background: 'rgba(0, 122, 255, 0.08)',
    borderRadius: '6px',
    lineHeight: '1.4',
    fontSize: '0.8rem',
  }

  const questionStyle = {
    marginBottom: '8px',
    lineHeight: '1.4',
    fontSize: '0.8rem',
  }

  // 如果使用 children，则支持 JSX 内容；否则使用传统的 question/answer 字符串
  if (children) {
    return <div style={qaStyle}>{children}</div>
  }

  return (
    <div style={qaStyle}>
      <div style={questionStyle}>
        <strong>问：</strong>
        {question}
      </div>
      <div style={answerStyle}>
        <strong>答：</strong>
        {answer}
      </div>
    </div>
  )
}

// QA 组件的问题部分 - 辅助组件
function Question({ children }) {
  const questionStyle = {
    marginBottom: '8px',
    lineHeight: '1.4',
    fontSize: '0.8rem',
  }

  return (
    <div style={questionStyle}>
      <strong>问：</strong>
      {children}
    </div>
  )
}

// QA 组件的答案部分 - 辅助组件
function Answer({ children }) {
  const answerStyle = {
    marginTop: '8px',
    padding: '8px',
    background: 'rgba(0, 122, 255, 0.08)',
    borderRadius: '6px',
    lineHeight: '1.4',
    fontSize: '0.8rem',
  }

  return (
    <div style={answerStyle}>
      <strong>答：</strong>
      {children}
    </div>
  )
}

// 概念卡片 - 手机优化紧凑版
function ConceptCard({ title, definition, examples = [], applications = [] }) {
  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    borderRadius: '10px',
    padding: '12px 14px',
    margin: '12px 0',
    overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
  }

  const titleStyle = {
    background: 'linear-gradient(90deg, #06b6d4 0%, #67e8f9 100%)',
    color: '#ffffff',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    margin: '0 0 12px 0',
    display: 'inline-block',
  }

  return (
    <div style={cardStyle}>
      <div style={titleStyle}>💡 {title}</div>
      <div>
        <Definition>{definition}</Definition>

        {examples.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <h4
              style={{
                color: '#06b6d4',
                fontSize: '0.8rem',
                marginBottom: '6px',
                fontWeight: '600',
              }}
            >
              例子：
            </h4>
            <ul style={{ margin: 0, paddingLeft: '16px' }}>
              {examples.map((example, index) => (
                <li key={index} style={{ margin: '4px 0', lineHeight: '1.4', fontSize: '0.8rem' }}>
                  {example}
                </li>
              ))}
            </ul>
          </div>
        )}

        {applications.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <h4
              style={{
                color: '#06b6d4',
                fontSize: '0.8rem',
                marginBottom: '6px',
                fontWeight: '600',
              }}
            >
              应用：
            </h4>
            <ul style={{ margin: 0, paddingLeft: '16px' }}>
              {applications.map((app, index) => (
                <li key={index} style={{ margin: '4px 0', lineHeight: '1.4', fontSize: '0.8rem' }}>
                  {app}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

const MathComponents = {
  Theorem,
  Lemma,
  Example,
  Corollary,
  Proof,
  Solution,
  Exercise,
  ExerciseItem,
  ExerciseSet,
  MathInline,
  MathBlock,
  Definition,
  FormulaBox,
  MathSteps,
  Step,
  MathChart,
  QA,
  Question,
  Answer,
  ConceptCard,
}

export default MathComponents
