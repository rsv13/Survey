import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import About from './pages/About'
import ContactUs from './pages/ContactUs'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Publication from './pages/Publication'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Survey from './pages/Survey'


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/survey" element={<Survey />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/publication" element={<Publication />} />
        <Route path="/about" element={<About />} />
        <Route path="/contactus" element={<ContactUs />} />
      </Routes>
    
    </BrowserRouter>
  )
}
