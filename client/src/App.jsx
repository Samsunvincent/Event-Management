import { React } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the Toastify styles

import UserRegistration from './Components/pages/Register and Login/UserRegistration';
import Home from './Components/pages/home/HomeComponent';
import Login from './Components/pages/Register and Login/Login';
import Admin from './Components/pages/Admin/Admin';
import Organaizer from './Components/pages/Organizer/Organizer';
import Attendees from './Components/pages/Attendees/Attendees';

function App() {
  return (
    <>
      <Router>
        {/* Global ToastContainer */}
        <ToastContainer />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<UserRegistration />} />
          <Route path='/login' element={<Login/>}/>
          <Route path='/Admin/:login/:id/:usertype' element={<Admin/>}/>
          <Route path='/Organizer/:login/:id/:usertype' element={<Organaizer/>}/>
          <Route path='/Attendees/:login/:id/:usertype' element={<Attendees/>}/>

        </Routes>
      </Router>
    </>
  );
}

export default App;
