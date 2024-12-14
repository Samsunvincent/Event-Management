import { React } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the Toastify styles

import UserRegistration from './Components/pages/Register and Login/UserRegistration';
import Home from './Components/pages/home/HomeComponent';
import Login from './Components/pages/Register and Login/Login';
import Admin from './Components/pages/Admin/Admin';
import Profile from './Components/pages/Profile/Profile';
import SingleView from './Components/pages/SingleView';
import ListEventForm from './Components/pages/ListEvent';



function App() {
  return (
    <>
      <Router>
        {/* Global ToastContainer */}
        <ToastContainer />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/:login/:id/:usertype' element={<Home/>}/>
          <Route path="/register" element={<UserRegistration />} />
          <Route path='/login' element={<Login/>}/>
          <Route path='/Admin/:login/:id/:usertype' element={<Admin/>}/>
          <Route path='/profile/:login/:id/:usertype' element={<Profile/>}/>
          <Route path='/singleView/:login/:id/:usertype/:e_id' element={<SingleView/>}/>
          <Route path='/listevent/:login/:id/:usertype' element={<ListEventForm/>}/>
       

        </Routes>
      </Router>
    </>
  );
}

export default App;
