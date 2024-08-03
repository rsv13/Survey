import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import About from './pages/About'
import ContactUs from './pages/ContactUs'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Publication from './pages/Publication'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Survey from './pages/Survey'

export default function App() {
  return (
    <BrowserRouter>
    <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/survey" element={<Survey />} />
<<<<<<< HEAD
        <Route element={<PrivateRoute />}>
=======
        <Route element={<PrivateRoute />} >
>>>>>>> 902bd37 (Make the dashboard private)
        <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/publication" element={<Publication />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/about" element={<About />} />
        <Route path="/contactus" element={<ContactUs />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
