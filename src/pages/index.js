import dynamic from 'next/dynamic'
const Main = dynamic(() => import('../components/Main'), {
  ssr: false,
})

export default Main
