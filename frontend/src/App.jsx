import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Signup from './compo/login_sigup/signup'
import Background from './back'
import Home from './home'
import  './back.css'
import Formss from './compo/login_sigup/form'
import Login from './compo/login_sigup/login'
import { ToastContainer } from 'react-toastify'
function App() {
  const [count, setCount] = useState(0)
  return (
    <div className="App">
      <Background/>
      <ToastContainer/>
     <Routes>
      
      <Route path='/'  element={<Signup/>}/>
       <Route path='/reset-password/:id' element={<Formss/>}/>
        <Route path='/login'element={<Login/>}/>
        <Route path='/form'element={<Formss/>}/>
        {/* <Route path='/verification'element={<Email/>}/> */}
      <Route path='/home'  element={<Home/>}/>
      {/* <Route path='/login'  element={<Login/>}/> */}
      {/* <Route path='/user/verification/:id' element={<Verification/>}/> */}
     </Routes>
    </div>
  )
}

export default App
