import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useRef,
} from 'react'
import { Transformer, builtInPlugins } from 'markmap-lib'
import { Markmap, loadCSS, loadJS } from 'markmap-view'
import { Toolbar } from 'markmap-toolbar'
import { prismPlugin } from './prism'

const plugins = builtInPlugins.filter((item) => item.name !== 'hljs')

const transformer = new Transformer([...plugins, prismPlugin])

function renderToolbar(mm: Markmap, wrapper: HTMLElement) {
  while (wrapper?.firstChild) wrapper.firstChild.remove()
  if (mm && wrapper) {
    const toolbar = new Toolbar()
    toolbar.attach(mm)
    toolbar.setItems([...Toolbar.defaultItems])
    wrapper.append(toolbar.render())
  }
}

export default forwardRef(function Preview(props, ref) {
  const [state, setState] = useState({
    config: '',
    html: '',
    css: '',
  })

  useImperativeHandle(
    ref,
    () => ({
      setState,
    }),
    []
  )
  const { html: md, config: js, css } = state
  // Ref for SVG element
  const refSvg = useRef<SVGSVGElement>(null)
  // Ref for markmap object
  const refMm = useRef<Markmap>()
  // Ref for toolbar wrapper
  const refToolbar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Create markmap and save to refMm
    if (refSvg.current && refToolbar.current) {
      const mm = Markmap.create(refSvg.current, {
        maxWidth: 400,
      })
      refMm.current = mm
      renderToolbar(refMm.current, refToolbar.current)
    }

    return () => {
      if (refMm.current) {
        refMm.current.destroy()
      }
    }
  }, [])

  useEffect(() => {
    // Update data for markmap once value is changed
    const mm = refMm.current
    if (!mm) return
    const { root } = transformer.transform(md)
    console.log(root)

    mm.setData(root)
    mm.fit()
  }, [md])

  return (
    <>
      <svg className="h-full w-full dark:bg-slate-900" ref={refSvg} />
      <div className="absolute bottom-2 right-2 flex" ref={refToolbar}></div>
    </>
  )
})
