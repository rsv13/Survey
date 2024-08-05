import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Components
import Footer from './components/Footer';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';

// Pages
import About from './pages/About';
import ContactUs from './pages/ContactUs';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Publication from './pages/Publication';
import Results from './pages/Results';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Survey from './pages/Survey';
import SurveyDetails from './pages/SurveyDetails';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/publication" element={<Publication />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/about" element={<About />} />
        <Route path="/contactus" element={<ContactUs />} />
        
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/survey" element={<Survey />} />
          <Route path="/results" element={<Results />} />
          <Route path="/survey-details" element={<SurveyDetails />} />
        </Route>
      
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
