import dynamic from 'next/dynamic'
const Main = dynamic(() => import('../components/Pen'), {
  ssr: false,
})

export default Main
