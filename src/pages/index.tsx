import dynamic from 'next/dynamic'

const App = dynamic(() => import('@/components/Pen'), {
  ssr: false,
})

export default App
