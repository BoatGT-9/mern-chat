import "./App.css";

import { UserContextProvider } from './context/Usercontext'
import Routes from './Routes'
import Navbar from "./components/Navbar";
import axios from "axios";
function App() {
  axios.defaults.baseURL = "http://localhost:5000"

  return (
    <>
    <UserContextProvider>
    {/* <Navbar/> */}
    <Routes />
    </UserContextProvider>

    </>
  )
}

export default App