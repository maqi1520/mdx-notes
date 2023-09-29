import dynamic from 'next/dynamic'
const Pen = dynamic(() => import('../components/Pen'), {
  ssr: false,
})

export default Pen
