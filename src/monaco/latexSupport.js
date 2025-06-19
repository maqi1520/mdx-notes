// LaTeX support for Monaco Editor
// Provides completion, syntax highlighting, and auto-pairing for LaTeX in MDX/Markdown files
// Based on data structure from LaTeX Workshop project

// 导入LaTeX数据
import { getLatexCompletionItems } from './latexData.js';
// 为Editor.js提供的接口函数
let latexSupportDisposable = null;

/**
 * 初始化LaTeX支持
 * @param {import('monaco-editor').editor.IStandaloneCodeEditor} editor 
 * @param {import('monaco-editor').editor} monaco 
 * @returns {object} disposable object
 */
export function initializeLatexSupport(editor, monaco) {
  console.log('Initializing LaTeX support...');
  
  if (!monaco) {
    console.warn('Monaco editor not found');
    return { dispose: () => {} };
  }
  
  // 测试LaTeX数据是否正确加载
  console.log('Testing LaTeX data loading...');
  try {
    const testItems = getLatexCompletionItems();
    console.log('LaTeX items loaded:', testItems.length, 'items');
    if (testItems.length > 0) {
      console.log('First few items:', testItems.slice(0, 3).map(item => item.label));
    }
  } catch (error) {
    console.error('Failed to load LaTeX items:', error);
  }
  
  if (latexSupportDisposable) {
    latexSupportDisposable.dispose();
  }
  
  // Register LaTeX language support
  latexSupportDisposable = registerLatexLanguageSupport(monaco);
  
  console.log('LaTeX support initialized successfully');
  return latexSupportDisposable;
}

/**
 * 清理LaTeX支持
 */
export function disposeLatexSupport() {
  if (latexSupportDisposable) {
    latexSupportDisposable.dispose();
    latexSupportDisposable = null;
  }
}

/**
 * Register LaTeX language support for Monaco Editor
 * @param {import('monaco-editor').editor} monaco - Monaco editor instance
 */
/**
 * Register LaTeX language support for Monaco Editor
 * @param {import('monaco-editor').editor} monaco - Monaco editor instance
 */
export function registerLatexLanguageSupport(monaco) {
  console.log('=== REGISTERING LATEX SUPPORT ===');
  
  // 测试导入的函数
  console.log('Testing getLatexCompletionItems function:', typeof getLatexCompletionItems);
  
  try {
    const testItems = getLatexCompletionItems();
    console.log('✅ Successfully loaded LaTeX items:', testItems.length);
    if (testItems.length > 0) {
      console.log('📄 Sample items:', testItems.slice(0, 5).map(item => ({
        label: item.label,
        detail: item.detail
      })));
    }
  } catch (error) {
    console.error('❌ Failed to load LaTeX items:', error);
    return { dispose: () => {} };
  }
  
  // Register LaTeX completion provider for MDX/Markdown files
  const completionProvider = monaco.languages.registerCompletionItemProvider(['markdown'], {
    triggerCharacters: ['\\'],
    
    provideCompletionItems: (model, position, context) => {
      console.log('🚀 LaTeX completion triggered!', { 
        position: { line: position.lineNumber, column: position.column },
        context: context.triggerKind 
      });
      
      const textUntilPosition = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });

      console.log('📝 Text until position:', JSON.stringify(textUntilPosition));

      // 检查是否输入了反斜杠
      if (!textUntilPosition.includes('\\')) {
        console.log('❌ No backslash found, returning empty suggestions');
        return { suggestions: [] };
      }

      console.log('✅ Backslash detected, getting LaTeX items...');

      // 找到反斜杠后的位置，只替换反斜杠后面的内容
      const lineContent = model.getLineContent(position.lineNumber);
      const beforeCursor = lineContent.substring(0, position.column - 1);
      const lastBackslashIndex = beforeCursor.lastIndexOf('\\');
      
      let range;
      if (lastBackslashIndex !== -1) {
        // 从反斜杠之后开始替换，保留反斜杠
        range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: lastBackslashIndex + 2, // 跳过反斜杠
          endColumn: position.column,
        };
      } else {
        // 如果没有找到反斜杠，使用默认的word范围
        const word = model.getWordUntilPosition(position);
        range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };
      }

      console.log('� Replacement range:', range);

      try {
        // Get LaTeX completion items
        const latexItems = getLatexCompletionItems();
        console.log('📚 LaTeX items count:', latexItems.length);
        
        // Convert to Monaco completion items
        const suggestions = latexItems.map(item => {
          // 如果insertText包含反斜杠，则去掉它，因为我们要保留用户已输入的反斜杠
          let insertText = item.insertText;
          if (insertText.startsWith('\\')) {
            insertText = insertText.substring(1);
          }
          
          return {
            label: item.label,
            kind: getCompletionItemKind(monaco, item.kind),
            insertText: insertText,
            insertTextRules: item.insertTextRules === 'InsertAsSnippet' 
              ? monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet 
              : undefined,
            documentation: item.documentation ? {
              value: `${item.documentation}${item.detail ? `\n\n**Symbol:** ${item.detail}` : ''}`,
              isTrusted: true
            } : undefined,
            detail: item.detail,
            range: range,
            sortText: getSortText(item.label, textUntilPosition)
          };
        });

        console.log('🎯 Returning suggestions:', suggestions.length);
        console.log('📋 Sample suggestions:', suggestions.slice(0, 3).map(s => s.label));
        return { suggestions };
      } catch (error) {
        console.error('❌ Error getting LaTeX completion items:', error);
        return { suggestions: [] };
      }
    }
  });

  // Register LaTeX hover provider
  const hoverProvider = monaco.languages.registerHoverProvider(['markdown'], {
    provideHover: (model, position) => {
      const isMathContext = isMathEnvironment(model, position);
      if (!isMathContext) {
        return null;
      }

      const word = model.getWordAtPosition(position);
      if (!word || !word.word.startsWith('\\')) {
        return null;
      }

      const latexItems = getLatexCompletionItems();
      const item = latexItems.find(item => item.label === word.word);
      
      if (item && item.documentation) {
        return {
          range: {
            startLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endLineNumber: position.lineNumber,
            endColumn: word.endColumn,
          },
          contents: [
            { value: `**${item.label}**` },
            { value: item.documentation },
            ...(item.detail ? [{ value: `Symbol: ${item.detail}` }] : [])
          ]
        };
      }

      return null;
    }
  });  // Register auto-closing pairs for math environments
  monaco.languages.setLanguageConfiguration('markdown', {
    autoClosingPairs: [
      // 保留默认的括号配对
      { open: '(', close: ')' },
      { open: '[', close: ']' },
      { open: '{', close: '}' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
      { open: '`', close: '`' },
      // 添加LaTeX特有的配对
      { open: '$', close: '$', notIn: ['string', 'comment'] },
      { open: '\\(', close: '\\)', notIn: ['string', 'comment'] },
      { open: '\\[', close: '\\]', notIn: ['string', 'comment'] },
      { open: '\\{', close: '\\}', notIn: ['string', 'comment'] },
      { open: '_{', close: '}', notIn: ['string', 'comment'] },
      { open: '^{', close: '}', notIn: ['string', 'comment'] }
    ],
    surroundingPairs: [
      { open: '(', close: ')' },
      { open: '[', close: ']' },
      { open: '{', close: '}' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
      { open: '`', close: '`' },
      { open: '$', close: '$' },
      { open: '\\(', close: '\\)' },
      { open: '\\[', close: '\\]' },
      { open: '\\{', close: '\\}' }
    ]
  });

  console.log('✅ Auto-closing pairs configured for markdown');

  return {
    dispose: () => {
      completionProvider.dispose();
      hoverProvider.dispose();
    }
  };
}

/**
 * Check if the current position is within a math environment
 * @param {import('monaco-editor').editor.ITextModel} model 
 * @param {import('monaco-editor').Position} position 
 * @returns {boolean}
 */
function isMathEnvironment(model, position) {
  const content = model.getValue();
  const offset = model.getOffsetAt(position);
  
  // Check for inline math: $...$
  const beforeContent = content.substring(0, offset);
  const afterContent = content.substring(offset);
  
  // Count unescaped $ before current position
  let dollarCount = 0;
  let i = 0;
  while (i < beforeContent.length) {
    if (beforeContent[i] === '$' && (i === 0 || beforeContent[i-1] !== '\\')) {
      dollarCount++;
    }
    i++;
  }
  
  // If odd number of $, we're inside inline math
  if (dollarCount % 2 === 1) {
    return true;
  }
  
  // Check for display math: \[...\] or $$...$$
  const displayMathRegex = /\\\[[\s\S]*?\\\]|\$\$[\s\S]*?\$\$/g;
  let match;
  while ((match = displayMathRegex.exec(content)) !== null) {
    if (offset >= match.index && offset <= match.index + match[0].length) {
      return true;
    }
  }
  
  // Check for math environments: \begin{equation}, \begin{align}, etc.
  const mathEnvRegex = /\\begin\{(equation|align|gather|split|multline|eqnarray|cases|matrix|pmatrix|bmatrix|vmatrix|Vmatrix|smallmatrix|array)\*?\}[\s\S]*?\\end\{\1\*?\}/g;
  while ((match = mathEnvRegex.exec(content)) !== null) {
    if (offset >= match.index && offset <= match.index + match[0].length) {
      return true;
    }
  }
  
  return false;
}

/**
 * Convert completion item kind string to Monaco kind
 * @param {import('monaco-editor').editor} monaco 
 * @param {string} kind 
 * @returns {import('monaco-editor').languages.CompletionItemKind}
 */
function getCompletionItemKind(monaco, kind) {
  switch (kind) {
    case 'Function':
      return monaco.languages.CompletionItemKind.Function;
    case 'Variable':
      return monaco.languages.CompletionItemKind.Variable;
    case 'Keyword':
      return monaco.languages.CompletionItemKind.Keyword;
    case 'Snippet':
      return monaco.languages.CompletionItemKind.Snippet;
    case 'Constant':
      return monaco.languages.CompletionItemKind.Constant;
    default:
      return monaco.languages.CompletionItemKind.Text;
  }
}

/**
 * Generate sort text for completion items
 * @param {string} label 
 * @param {string} context 
 * @returns {string}
 */
function getSortText(label, context) {
  // Prioritize items that match the current context
  const lastWord = context.split(/\s+/).pop() || '';
  if (label.toLowerCase().includes(lastWord.toLowerCase())) {
    return '0' + label; // Higher priority
  }
  return '1' + label; // Lower priority
}

/**
 * Handle smart dollar sign pairing
 * @param {import('monaco-editor').editor.IStandaloneCodeEditor} editor 
 */
/**
 * Enhanced math environment detection with better handling of nested environments
 * @param {import('monaco-editor').editor.ITextModel} model 
 * @param {import('monaco-editor').Position} position 
 * @returns {{inMath: boolean, mathType: string | null, range: {start: number, end: number} | null}}
 */
export function getMathContext(model, position) {
  const content = model.getValue();
  const offset = model.getOffsetAt(position);
  
  // Check inline math first
  const beforeContent = content.substring(0, offset);
  const afterContent = content.substring(offset);
  
  // Find all $ positions
  const dollarPositions = [];
  for (let i = 0; i < content.length; i++) {
    if (content[i] === '$' && (i === 0 || content[i-1] !== '\\')) {
      dollarPositions.push(i);
    }
  }
  
  // Check if we're between two $ (inline math)
  for (let i = 0; i < dollarPositions.length - 1; i += 2) {
    if (offset > dollarPositions[i] && offset < dollarPositions[i + 1]) {
      return {
        inMath: true,
        mathType: 'inline',
        range: { start: dollarPositions[i], end: dollarPositions[i + 1] }
      };
    }
  }
  
  // Check display math environments
  const mathEnvs = [
    { start: /\\\[/g, end: /\\\]/g, type: 'display' },
    { start: /\$\$/g, end: /\$\$/g, type: 'display' },
    { start: /\\begin\{(equation|align|gather|split|multline|eqnarray|cases|matrix|pmatrix|bmatrix|vmatrix|Vmatrix|smallmatrix|array)\*?\}/g, end: /\\end\{(equation|align|gather|split|multline|eqnarray|cases|matrix|pmatrix|bmatrix|vmatrix|Vmatrix|smallmatrix|array)\*?\}/g, type: 'environment' }
  ];
  
  for (const env of mathEnvs) {
    env.start.lastIndex = 0;
    env.end.lastIndex = 0;
    
    let startMatch, endMatch;
    while ((startMatch = env.start.exec(content)) !== null) {
      env.end.lastIndex = startMatch.index + startMatch[0].length;
      endMatch = env.end.exec(content);
      
      if (endMatch && offset > startMatch.index && offset < endMatch.index + endMatch[0].length) {
        return {
          inMath: true,
          mathType: env.type,
          range: { start: startMatch.index, end: endMatch.index + endMatch[0].length }
        };
      }
    }
  }
  
  return { inMath: false, mathType: null, range: null };
}

export default {
  registerLatexLanguageSupport,
  initializeLatexSupport,
  disposeLatexSupport,
  getMathContext
};
