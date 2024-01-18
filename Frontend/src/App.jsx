import "./App.css";
import { useState } from 'react'
import { UserContextProvider } from './context/Usercontext'
import Routes from './Routes'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <UserContextProvider>
    <Routes />
    </UserContextProvider>

    </>
  )
}

export default App