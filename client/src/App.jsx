
import { React } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import UserRegistration from './Components/pages/Register/UserRegistration'
import Home from './Components/pages/home/HomeComponent';




function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element ={<Home/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
