import dynamic from 'next/dynamic'
const App = dynamic(() => import('../components/App'), {
  ssr: false,
})

export default App
