import { forwardRef, useEffect, useState, useRef } from 'react'
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect'
import clsx from 'clsx'
import { getPointerPosition } from '../utils/getPointerPosition'

export const Preview = forwardRef(function Page(
  {
    responsiveDesignMode,
    responsiveSize,
    onChangeResponsiveSize,
    onLoad,
    iframeClassName = '',
  },
  ref
) {
  const containerRef = useRef()
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [resizing, setResizing] = useState()
  const timeout = useRef()
  const constrainedResponsiveSize = constrainSize(
    responsiveSize.width,
    responsiveSize.height
  )

  function constrainWidth(desiredWidth) {
    const zoom =
      desiredWidth > size.width - 34 ? (size.width - 34) / desiredWidth : 1
    return {
      width: Math.min(
        Math.max(50, Math.round(desiredWidth * (1 / zoom))),
        Math.round((size.width - 34) * (1 / zoom))
      ),
      zoom,
    }
  }

  function constrainHeight(desiredHeight) {
    const zoom =
      desiredHeight > size.height - 17 - 40
        ? (size.height - 17 - 40) / desiredHeight
        : 1
    return {
      height: Math.min(
        Math.max(50, Math.round(desiredHeight * (1 / zoom))),
        Math.round((size.height - 17 - 40) * (1 / zoom))
      ),
      zoom,
    }
  }

  function constrainSize(desiredWidth, desiredHeight) {
    const { width, zoom: widthZoom } = constrainWidth(desiredWidth)
    const { height, zoom: heightZoom } = constrainHeight(desiredHeight)
    return {
      width,
      height,
      zoom: Math.min(widthZoom, heightZoom),
    }
  }

  useEffect(() => {
    let isInitial = true
    const observer = new ResizeObserver(() => {
      window.clearTimeout(timeout.current)
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const width = Math.round(rect.width)
        const height = Math.round(rect.height)
        setSize({
          visible: !isInitial && width !== 0 && height !== 0,
          width,
          height,
        })
      }
      timeout.current = window.setTimeout(() => {
        setSize((size) => ({ ...size, visible: false }))
      }, 1000)
      isInitial = false
    })
    observer.observe(containerRef.current)
    return () => {
      observer.disconnect()
    }
  }, [])

  useIsomorphicLayoutEffect(() => {
    if (
      size.width > 50 &&
      size.height > 50 &&
      typeof onChangeResponsiveSize == 'function'
    ) {
      onChangeResponsiveSize(({ width, height }) => ({ width, height }))
    }

    if (resizing) {
      function onMouseMove(e) {
        e.preventDefault()
        const { x, y } = getPointerPosition(e)
        if (resizing.handle === 'bottom') {
          document.body.classList.add('cursor-ns-resize')
          onChangeResponsiveSize(({ width }) => ({
            width,
            height: resizing.startHeight + (y - resizing.startY),
          }))
        } else if (resizing.handle === 'left') {
          document.body.classList.add('cursor-ew-resize')
          onChangeResponsiveSize(({ height }) => ({
            width: resizing.startWidth - (x - resizing.startX) * 2,
            height,
          }))
        } else if (resizing.handle === 'right') {
          document.body.classList.add('cursor-ew-resize')
          onChangeResponsiveSize(({ height }) => ({
            width: resizing.startWidth + (x - resizing.startX) * 2,
            height,
          }))
        } else if (resizing.handle === 'bottom-left') {
          document.body.classList.add('cursor-nesw-resize')
          onChangeResponsiveSize(() => ({
            width: resizing.startWidth - (x - resizing.startX) * 2,
            height: resizing.startHeight + (y - resizing.startY),
          }))
        } else if (resizing.handle === 'bottom-right') {
          document.body.classList.add('cursor-nwse-resize')
          onChangeResponsiveSize(() => ({
            width: resizing.startWidth + (x - resizing.startX) * 2,
            height: resizing.startHeight + (y - resizing.startY),
          }))
        }
      }
      function onMouseUp(e) {
        e.preventDefault()
        if (resizing.handle === 'bottom') {
          document.body.classList.remove('cursor-ns-resize')
        } else if (resizing.handle === 'left') {
          document.body.classList.remove('cursor-ew-resize')
        } else if (resizing.handle === 'right') {
          document.body.classList.remove('cursor-ew-resize')
        } else if (resizing.handle === 'bottom-left') {
          document.body.classList.remove('cursor-nesw-resize')
        } else if (resizing.handle === 'bottom-right') {
          document.body.classList.remove('cursor-nwse-resize')
        }
        setResizing()
      }
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp)
      window.addEventListener('touchmove', onMouseMove)
      window.addEventListener('touchend', onMouseUp)
      return () => {
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseup', onMouseUp)
        window.removeEventListener('touchmove', onMouseMove)
        window.removeEventListener('touchend', onMouseUp)
      }
    }
  }, [resizing, size])

  function startLeft(e) {
    const pos = getPointerPosition(e)
    if (pos === null) return
    e.preventDefault()
    setResizing({
      handle: 'left',
      startWidth: constrainedResponsiveSize.width,
      startX: pos.x,
    })
  }

  function startRight(e) {
    const pos = getPointerPosition(e)
    if (pos === null) return
    e.preventDefault()
    setResizing({
      handle: 'right',
      startWidth: constrainedResponsiveSize.width,
      startX: pos.x,
    })
  }

  function startBottomLeft(e) {
    const pos = getPointerPosition(e)
    if (pos === null) return
    e.preventDefault()
    setResizing({
      handle: 'bottom-left',
      startWidth: constrainedResponsiveSize.width,
      startHeight: constrainedResponsiveSize.height,
      startX: pos.x,
      startY: pos.y,
    })
  }

  function startBottom(e) {
    const pos = getPointerPosition(e)
    if (pos === null) return
    e.preventDefault()
    setResizing({
      handle: 'bottom',
      startHeight: constrainedResponsiveSize.height,
      startY: pos.y,
    })
  }

  function startBottomRight(e) {
    const pos = getPointerPosition(e)
    if (pos === null) return
    e.preventDefault()
    setResizing({
      handle: 'bottom-right',
      startWidth: constrainedResponsiveSize.width,
      startHeight: constrainedResponsiveSize.height,
      startX: pos.x,
      startY: pos.y,
    })
  }

  return (
    <div className="absolute inset-0 flex flex-col" ref={containerRef}>
      {responsiveDesignMode && (
        <div className="flex-none text-center text-xs leading-4 tabular-nums whitespace-pre py-3 text-gray-900 dark:text-gray-400">
          {constrainedResponsiveSize.width}
          {'  '}×{'  '}
          {constrainedResponsiveSize.height}
          {'  '}
          <span className="text-gray-500">
            ({Math.round(constrainedResponsiveSize.zoom * 100)}
            %)
          </span>
        </div>
      )}
      <div
        className="flex-auto grid justify-center"
        style={
          responsiveDesignMode
            ? {
                gridTemplateColumns: '1.0625rem min-content 1.0625rem',
                gridTemplateRows: 'min-content 1.0625rem',
              }
            : { gridTemplateColumns: '100%' }
        }
      >
        {responsiveDesignMode && (
          <div
            className="cursor-ew-resize select-none bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-400 transition-colors duration-150 flex items-center justify-center"
            onMouseDown={startLeft}
            onTouchStart={startLeft}
          >
            <svg
              viewBox="0 0 6 16"
              width={6}
              height={16}
              fill="none"
              stroke="currentColor"
            >
              <path d="M 0.5 0 V 16 M 5.5 0 V 16" />
            </svg>
          </div>
        )}
        <div
          className={clsx('relative', {
            'border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden':
              responsiveDesignMode,
          })}
          style={
            responsiveDesignMode
              ? {
                  width: Math.round(
                    constrainedResponsiveSize.width *
                      constrainedResponsiveSize.zoom
                  ),
                  height: Math.round(
                    constrainedResponsiveSize.height *
                      constrainedResponsiveSize.zoom
                  ),
                }
              : {}
          }
        >
          <iframe
            ref={ref}
            title="Preview"
            style={
              responsiveDesignMode
                ? {
                    width: constrainedResponsiveSize.width,
                    height: constrainedResponsiveSize.height,
                    marginLeft:
                      (constrainedResponsiveSize.width -
                        Math.round(
                          constrainedResponsiveSize.width *
                            constrainedResponsiveSize.zoom
                        )) /
                      -2,
                    transformOrigin: 'top',
                    transform: `scale(${constrainedResponsiveSize.zoom})`,
                  }
                : {}
            }
            onLoad={onLoad}
            className={clsx(
              iframeClassName,
              'absolute inset-0 w-full h-full bg-white',
              {
                'pointer-events-none select-none': resizing,
              }
            )}
            sandbox="allow-popups-to-escape-sandbox allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation allow-modals"
            srcDoc={`
                <!DOCTYPE html>
                <html>
                  <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <style>
                    body {
                      margin: 0;
                      font-family: -apple-system-font, BlinkMacSystemFont, 'Helvetica Neue',
                        'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei UI', 'Microsoft YaHei',
                        Arial, sans-serif;
                      text-align: justify;
                      font-size: 17px;
                      color: #333;
                      padding:20px 16px 9px;
                    }
                    body * {
                      box-sizing: border-box;
                      box-sizing: border-box !important;
                      word-wrap: break-word !important;
                    }
                    table {
                      margin-bottom: 10px;
                      border-collapse: collapse;
                      display: table;
                    }
                    td,
                    th {
                      padding: 5px 10px;
                      border: 1px solid #ddd;
                    }
                    caption {
                      border: 1px dashed #ddd;
                      border-bottom: 0;
                      padding: 3px;
                      text-align: center;
                    }
                    th {
                      border-top: 2px solid #bbb;
                      background: #f7f7f7;
                    }
                    td p {
                      margin: 0;
                      padding: 0;
                    }
                    .markdown-body{
                      overflow-x:hidden;
                    }
                    </style>
                    <style type="text/css" media="print">
                    @page {
                      size: A4;
                    }
                    p,table,img {
                      page-break-inside: avoid;
                    }
                    body {-webkit-print-color-adjust: exact;}
                    </style>
                    <style id="_style"></style>
                    <script>
                    var hasHtml = false
                    var hasCss = false
                    window.addEventListener('message', (e) => {
                      if (typeof e.data.line  !== 'undefined') {
                        var previewEl = document.documentElement
                        const el = previewEl.querySelector('[data-line="'+e.data.line+'"]');
                        if(el){ 
                          previewEl.scrollTo({
                            top: el.offsetTop - el.parentNode.scrollTop,
                            // behavior: 'smooth',
                          });
                        }
                        return
                      }
                      if (typeof e.data.print  !== 'undefined') {
                        window.print();
                        return
                      }
                      if (typeof e.data.clear !== 'undefined') {
                        setHtml()
                        setCss()
                        checkVisibility()
                        return
                      }
                      if (typeof e.data.css !== 'undefined') {
                        setCss(e.data.css)
                      }
                      if (typeof e.data.html !== 'undefined') {
                        setHtml(e.data.html)
                        if(e.data.scrollEnd){
                          window.scrollTo({
                            top: 999,
                            left: 0,
                            behavior: 'smooth'
                          });
                        }
                      }
                    })
                    function setHtml(html) {
                      const root = document.getElementById('root')
                      if (typeof html === 'undefined') {
                        root.innerHTML = ''
                        hasHtml = false
                      } else {
                        root.innerHTML = html
                        hasHtml = true
                      }
                    }
                    function setCss(css) {
                      const style = document.getElementById('_style')
                      const newStyle = document.createElement('style')
                      newStyle.id = '_style'
                      newStyle.innerHTML = typeof css === 'undefined' ? '' : css
                      style.parentNode.replaceChild(newStyle, style)
                      hasCss = typeof css === 'undefined' ? false : true
                    }
                    </script>
                  </head>
                  <body>
                    <div id="root"></div>
                    <script>
                  //  var previewEl = document
                  //   function getTopRelativeToPreview(el) {
                  //     return el.offsetTop - document.documentElement.scrollTop;
                  //   }
                    
                  //   previewEl.addEventListener('scroll', function() {
                  //     const els = previewEl.querySelectorAll('[data-line]');
                  //     let line;
                  //     for (const el of els) {
                  //       if (getTopRelativeToPreview(el) >= 0) {
                  //         line = parseInt(el.getAttribute('data-line'), 10);
                  //         break;
                  //       }
                  //     }
                  //     window.top.postMessage({event:'preview-scroll',line:line}, '*');
                  //   });

                  // https://github.com/sveltejs/svelte-repl/blob/master/src/Output/srcdoc/index.html
                  // https://github.com/sveltejs/svelte-repl/blob/master/LICENSE
                  document.body.addEventListener('click', event => {
                    if (event.which !== 1) return;
                    if (event.metaKey || event.ctrlKey || event.shiftKey) return;
                    if (event.defaultPrevented) return;

                    // ensure target is a link
                    let el = event.target;
                    while (el && el.nodeName !== 'A') el = el.parentNode;
                    if (!el || el.nodeName !== 'A') return;

                    if (el.hasAttribute('download') || el.getAttribute('rel') === 'external' || el.target) return;

                    event.preventDefault();
                    window.open(el.href, '_blank');
                  });
                  </script>

                  </body>
                </html>
              `}
          />
        </div>
        {responsiveDesignMode && (
          <>
            <div
              className="cursor-ew-resize select-none bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-400 transition-colors duration-150 flex items-center justify-center"
              onMouseDown={startRight}
              onTouchStart={startRight}
            >
              <svg
                viewBox="0 0 6 16"
                width={6}
                height={16}
                fill="none"
                stroke="currentColor"
              >
                <path d="M 0.5 0 V 16 M 5.5 0 V 16" />
              </svg>
            </div>
            <div
              className="cursor-nesw-resize select-none bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-400 transition-colors duration-150 flex items-center justify-center"
              onMouseDown={startBottomLeft}
              onTouchStart={startBottomLeft}
            >
              <svg
                viewBox="0 0 16 6"
                width={16}
                height={6}
                fill="none"
                stroke="currentColor"
                className="transform translate-x-0.5 -translate-y-0.5 rotate-45"
              >
                <path d="M 0 0.5 H 16 M 0 5.5 H 16" />
              </svg>
            </div>
            <div
              className="cursor-ns-resize select-none bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-400 transition-colors duration-150 flex items-center justify-center"
              onMouseDown={startBottom}
              onTouchStart={startBottom}
            >
              <svg
                viewBox="0 0 16 6"
                width={16}
                height={6}
                fill="none"
                stroke="currentColor"
              >
                <path d="M 0 0.5 H 16 M 0 5.5 H 16" />
              </svg>
            </div>
            <div
              className="cursor-nwse-resize select-none bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-400 transition-colors duration-150 flex items-center justify-center"
              onMouseDown={startBottomRight}
              onTouchStart={startBottomRight}
            >
              <svg
                viewBox="0 0 16 6"
                width={16}
                height={6}
                fill="none"
                stroke="currentColor"
                className="transform -translate-x-0.5 -translate-y-0.5 -rotate-45"
              >
                <path d="M 0 0.5 H 16 M 0 5.5 H 16" />
              </svg>
            </div>
          </>
        )}
      </div>
      {!responsiveDesignMode && size.visible && (
        <div className="absolute top-4 right-4 rounded-full h-6 flex items-center text-xs leading-4 whitespace-pre px-3 tabular-nums bg-white border border-gray-300 shadow dark:bg-gray-700 dark:border-transparent">
          {size.width}
          {'  '}×{'  '}
          {size.height}
        </div>
      )}
    </div>
  )
})
