import CodeMirror from 'codemirror'

export function tailwindcssMode(config, parserConfig) {
  var inline = parserConfig.inline
  if (!parserConfig.propertyKeywords)
    parserConfig = CodeMirror.resolveMode('text/css')

  var indentUnit = config.indentUnit,
    tokenHooks = parserConfig.tokenHooks,
    documentTypes = parserConfig.documentTypes || {},
    mediaTypes = parserConfig.mediaTypes || {},
    mediaFeatures = parserConfig.mediaFeatures || {},
    mediaValueKeywords = parserConfig.mediaValueKeywords || {},
    propertyKeywords = parserConfig.propertyKeywords || {},
    nonStandardPropertyKeywords =
      parserConfig.nonStandardPropertyKeywords || {},
    fontProperties = parserConfig.fontProperties || {},
    counterDescriptors = parserConfig.counterDescriptors || {},
    colorKeywords = parserConfig.colorKeywords || {},
    valueKeywords = parserConfig.valueKeywords || {},
    allowNested = parserConfig.allowNested,
    lineComment = parserConfig.lineComment,
    supportsAtComponent = parserConfig.supportsAtComponent === true

  var type, override
  function ret(style, tp) {
    type = tp
    return style
  }

  // Tokenizers

  function tokenBase(stream, state) {
    var ch = stream.next()
    if (tokenHooks[ch]) {
      var result = tokenHooks[ch](stream, state)
      if (result !== false) return result
    }
    if (ch == '@') {
      stream.eatWhile(/[\w\\\-]/)
      return ret('def', stream.current())
    } else if (ch == '=' || ((ch == '~' || ch == '|') && stream.eat('='))) {
      return ret(null, 'compare')
    } else if (ch == '"' || ch == "'") {
      state.tokenize = tokenString(ch)
      return state.tokenize(stream, state)
    } else if (ch == '#') {
      stream.eatWhile(/[\w\\\-]/)
      return ret('atom', 'hash')
    } else if (ch == '!') {
      stream.match(/^\s*\w*/)
      return ret('keyword', 'important')
    } else if (/\d/.test(ch) || (ch == '.' && stream.eat(/\d/))) {
      stream.eatWhile(/[\w.%]/)
      return ret('number', 'unit')
    } else if (ch === '-') {
      if (/[\d.]/.test(stream.peek())) {
        stream.eatWhile(/[\w.%]/)
        return ret('number', 'unit')
      } else if (stream.match(/^-[\w\\\-]*/)) {
        stream.eatWhile(/[\w\\\-]/)
        if (stream.match(/^\s*:/, false))
          return ret('variable-2', 'variable-definition')
        return ret('variable-2', 'variable')
      } else if (stream.match(/^\w+-/)) {
        return ret('meta', 'meta')
      }
    } else if (/[,+>*\/]/.test(ch)) {
      return ret(null, 'select-op')
    } else if (ch == '.' && stream.match(/^-?[_a-z][_a-z0-9-]*/i)) {
      return ret('qualifier', 'qualifier')
    } else if (/[:;{}\[\]\(\)]/.test(ch)) {
      return ret(null, ch)
    } else if (stream.match(/[\w-.]+(?=\()/)) {
      if (
        /^(url(-prefix)?|domain|regexp)$/.test(stream.current().toLowerCase())
      ) {
        state.tokenize = tokenParenthesized
      }
      return ret('variable callee', 'variable')
    } else if (/[\w\\\-]/.test(ch)) {
      stream.eatWhile(/[\w\\\-]/)
      return ret('property', 'word')
    } else {
      return ret(null, null)
    }
  }

  function tokenString(quote) {
    return function (stream, state) {
      var escaped = false,
        ch
      while ((ch = stream.next()) != null) {
        if (ch == quote && !escaped) {
          if (quote == ')') stream.backUp(1)
          break
        }
        escaped = !escaped && ch == '\\'
      }
      if (ch == quote || (!escaped && quote != ')')) state.tokenize = null
      return ret('string', 'string')
    }
  }

  function tokenParenthesized(stream, state) {
    stream.next() // Must be '('
    if (!stream.match(/\s*[\"\')]/, false)) state.tokenize = tokenString(')')
    else state.tokenize = null
    return ret(null, '(')
  }

  // Context management

  function Context(type, indent, prev) {
    this.type = type
    this.indent = indent
    this.prev = prev
  }

  function pushContext(state, stream, type, indent) {
    state.context = new Context(
      type,
      stream.indentation() + (indent === false ? 0 : indentUnit),
      state.context
    )
    return type
  }

  function popContext(state) {
    if (state.context.prev) state.context = state.context.prev
    return state.context.type
  }

  function pass(type, stream, state) {
    return states[state.context.type](type, stream, state)
  }
  function popAndPass(type, stream, state, n) {
    for (var i = n || 1; i > 0; i--) state.context = state.context.prev
    return pass(type, stream, state)
  }

  // Parser

  function wordAsValue(stream) {
    var word = stream.current().toLowerCase()
    if (valueKeywords.hasOwnProperty(word)) override = 'atom'
    else if (colorKeywords.hasOwnProperty(word)) override = 'keyword'
    else override = 'variable'
  }

  var states = {}

  states.top = function (type, stream, state) {
    if (type == '{') {
      return pushContext(state, stream, 'block')
    } else if (type == '}' && state.context.prev) {
      return popContext(state)
    } else if (supportsAtComponent && /@component/i.test(type)) {
      return pushContext(state, stream, 'atComponentBlock')
    } else if (/^@(-moz-)?document$/i.test(type)) {
      return pushContext(state, stream, 'documentTypes')
    } else if (/^@(media|supports|(-moz-)?document|import)$/i.test(type)) {
      return pushContext(state, stream, 'atBlock')
    } else if (/^@(font-face|counter-style)/i.test(type)) {
      state.stateArg = type
      return 'restricted_atBlock_before'
    } else if (/^@(-(moz|ms|o|webkit)-)?keyframes$/i.test(type)) {
      return 'keyframes'
    } else if (/^@screen$/i.test(type)) {
      return 'screen'
    } else if (type && type.charAt(0) == '@') {
      return pushContext(state, stream, 'at')
    } else if (type == 'hash') {
      override = 'builtin'
    } else if (type == 'word') {
      override = 'qualifier'
    } else if (type == 'variable-definition') {
      return 'maybeprop'
    } else if (type == 'interpolation') {
      return pushContext(state, stream, 'interpolation')
    } else if (type == ':') {
      return 'pseudo'
    } else if (allowNested && type == '(') {
      return pushContext(state, stream, 'parens')
    }
    return state.context.type
  }

  states.block = function (type, stream, state) {
    if (type == 'word') {
      var word = stream.current().toLowerCase()
      if (propertyKeywords.hasOwnProperty(word)) {
        override = 'property'
        return 'maybeprop'
      } else if (nonStandardPropertyKeywords.hasOwnProperty(word)) {
        override = 'string-2'
        return 'maybeprop'
      } else if (allowNested) {
        override = stream.match(/^\s*:(?:\s|$)/, false) ? 'property' : 'tag'
        return 'block'
      } else {
        override += ' error'
        return 'maybeprop'
      }
    } else if (type == 'meta') {
      return 'block'
    } else if (!allowNested && (type == 'hash' || type == 'qualifier')) {
      override = 'error'
      return 'block'
    } else {
      return states.top(type, stream, state)
    }
  }

  states.maybeprop = function (type, stream, state) {
    if (type == ':') return pushContext(state, stream, 'prop')
    return pass(type, stream, state)
  }

  states.prop = function (type, stream, state) {
    if (type == ';') return popContext(state)
    if (type == '{' && allowNested)
      return pushContext(state, stream, 'propBlock')
    if (type == '}' || type == '{') return popAndPass(type, stream, state)
    if (type == '(') return pushContext(state, stream, 'parens')

    if (
      type == 'hash' &&
      !/^#([0-9a-fA-f]{3,4}|[0-9a-fA-f]{6}|[0-9a-fA-f]{8})$/.test(
        stream.current()
      )
    ) {
      override += ' error'
    } else if (type == 'word') {
      wordAsValue(stream)
    } else if (type == 'interpolation') {
      return pushContext(state, stream, 'interpolation')
    }
    return 'prop'
  }

  states.propBlock = function (type, _stream, state) {
    if (type == '}') return popContext(state)
    if (type == 'word') {
      override = 'property'
      return 'maybeprop'
    }
    return state.context.type
  }

  states.parens = function (type, stream, state) {
    if (type == '{' || type == '}') return popAndPass(type, stream, state)
    if (type == ')') return popContext(state)
    if (type == '(') return pushContext(state, stream, 'parens')
    if (type == 'interpolation')
      return pushContext(state, stream, 'interpolation')
    if (type == 'word') wordAsValue(stream)
    return 'parens'
  }

  states.pseudo = function (type, stream, state) {
    if (type == 'meta') return 'pseudo'

    if (type == 'word') {
      override = 'variable-3'
      return state.context.type
    }
    return pass(type, stream, state)
  }

  states.documentTypes = function (type, stream, state) {
    if (type == 'word' && documentTypes.hasOwnProperty(stream.current())) {
      override = 'tag'
      return state.context.type
    } else {
      return states.atBlock(type, stream, state)
    }
  }

  states.atBlock = function (type, stream, state) {
    if (type == '(') return pushContext(state, stream, 'atBlock_parens')
    if (type == '}' || type == ';') return popAndPass(type, stream, state)
    if (type == '{')
      return (
        popContext(state) &&
        pushContext(state, stream, allowNested ? 'block' : 'top')
      )

    if (type == 'interpolation')
      return pushContext(state, stream, 'interpolation')

    if (type == 'word') {
      var word = stream.current().toLowerCase()
      if (word == 'only' || word == 'not' || word == 'and' || word == 'or')
        override = 'keyword'
      else if (mediaTypes.hasOwnProperty(word)) override = 'attribute'
      else if (mediaFeatures.hasOwnProperty(word)) override = 'property'
      else if (mediaValueKeywords.hasOwnProperty(word)) override = 'keyword'
      else if (propertyKeywords.hasOwnProperty(word)) override = 'property'
      else if (nonStandardPropertyKeywords.hasOwnProperty(word))
        override = 'string-2'
      else if (valueKeywords.hasOwnProperty(word)) override = 'atom'
      else if (colorKeywords.hasOwnProperty(word)) override = 'keyword'
      else override = 'error'
    }
    return state.context.type
  }

  states.atComponentBlock = function (type, stream, state) {
    if (type == '}') return popAndPass(type, stream, state)
    if (type == '{')
      return (
        popContext(state) &&
        pushContext(state, stream, allowNested ? 'block' : 'top', false)
      )
    if (type == 'word') override = 'error'
    return state.context.type
  }

  states.atBlock_parens = function (type, stream, state) {
    if (type == ')') return popContext(state)
    if (type == '{' || type == '}') return popAndPass(type, stream, state, 2)
    return states.atBlock(type, stream, state)
  }

  states.restricted_atBlock_before = function (type, stream, state) {
    if (type == '{') return pushContext(state, stream, 'restricted_atBlock')
    if (type == 'word' && state.stateArg == '@counter-style') {
      override = 'variable'
      return 'restricted_atBlock_before'
    }
    return pass(type, stream, state)
  }

  states.restricted_atBlock = function (type, stream, state) {
    if (type == '}') {
      state.stateArg = null
      return popContext(state)
    }
    if (type == 'word') {
      if (
        (state.stateArg == '@font-face' &&
          !fontProperties.hasOwnProperty(stream.current().toLowerCase())) ||
        (state.stateArg == '@counter-style' &&
          !counterDescriptors.hasOwnProperty(stream.current().toLowerCase()))
      )
        override = 'error'
      else override = 'property'
      return 'maybeprop'
    }
    return 'restricted_atBlock'
  }

  states.keyframes = function (type, stream, state) {
    if (type == 'word') {
      override = 'variable'
      return 'keyframes'
    }
    if (type == '{') return pushContext(state, stream, 'top')
    return pass(type, stream, state)
  }

  states.screen = function (type, stream, state) {
    if (type == 'word') {
      override = 'variable'
      return 'screen'
    }
    if (type == '{') return pushContext(state, stream, 'top')
    return pass(type, stream, state)
  }

  states.at = function (type, stream, state) {
    if (type == ';') return popContext(state)
    if (type == '{' || type == '}') return popAndPass(type, stream, state)
    if (type == 'word') override = 'tag'
    else if (type == 'hash') override = 'builtin'
    return 'at'
  }

  states.interpolation = function (type, stream, state) {
    if (type == '}') return popContext(state)
    if (type == '{' || type == ';') return popAndPass(type, stream, state)
    if (type == 'word') override = 'variable'
    else if (type != 'variable' && type != '(' && type != ')')
      override = 'error'
    return 'interpolation'
  }

  return {
    startState: function (base) {
      return {
        tokenize: null,
        state: inline ? 'block' : 'top',
        stateArg: null,
        context: new Context(inline ? 'block' : 'top', base || 0, null),
      }
    },

    token: function (stream, state) {
      if (!state.tokenize && stream.eatSpace()) return null
      var style = (state.tokenize || tokenBase)(stream, state)
      if (style && typeof style == 'object') {
        type = style[1]
        style = style[0]
      }
      override = style
      if (type != 'comment')
        state.state = states[state.state](type, stream, state)
      return override
    },

    indent: function (state, textAfter) {
      var cx = state.context,
        ch = textAfter && textAfter.charAt(0)
      var indent = cx.indent
      if (cx.type == 'prop' && (ch == '}' || ch == ')')) cx = cx.prev
      if (cx.prev) {
        if (
          ch == '}' &&
          (cx.type == 'block' ||
            cx.type == 'top' ||
            cx.type == 'interpolation' ||
            cx.type == 'restricted_atBlock')
        ) {
          // Resume indentation from parent context.
          cx = cx.prev
          indent = cx.indent
        } else if (
          (ch == ')' && (cx.type == 'parens' || cx.type == 'atBlock_parens')) ||
          (ch == '{' && (cx.type == 'at' || cx.type == 'atBlock'))
        ) {
          // Dedent relative to current context.
          indent = Math.max(0, cx.indent - indentUnit)
        }
      }
      return indent
    },

    electricChars: '}',
    blockCommentStart: '/*',
    blockCommentEnd: '*/',
    blockCommentContinue: ' * ',
    lineComment: lineComment,
    fold: 'brace',
  }
}
