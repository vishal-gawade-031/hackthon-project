import { useState } from 'react'
import { Button } from "@/components/ui/button"
import './App.css'
import Login from './pages/login'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <div className="text-3xl font-bold underline bg-green-700 flex justify-center items-center"> working tailwind page</div>
     <Button>Click me</Button>
    <Login/>
    </>
  )
}

export default App
