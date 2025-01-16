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
import AddedEvent from './Components/pages/Profile/AddedEvent';
import AddEvents from './Components/pages/Events/AddEvents';
import Tickets from './Components/pages/Profile/Tickets';
import BookingEvent from './Components/pages/BookingEvent';
import Participants from './Components/pages/Participants';
import UpdateEvent from './Components/pages/UpdateEvent';
import AllEvents from './Components/pages/Admin/AllEventsAdmin';
import AllAttendees from './Components/pages/Admin/AllAttendees';
import AllOrganizers from './Components/pages/Admin/AllOrganizers';

function App() {
  return (
    <>
      <Router>
        {/* Global ToastContainer */}
        <ToastContainer />

        <Routes>
          <Route path="/" element={<Home />} />

          {/* Specific routes come first */}
          <Route path="/singleView/:login/:id?/:usertype/:e_id" element={<SingleView />} />
          <Route path="/bookevent/:login/:id/:usertype/:e_id" element={<BookingEvent />} />

          {/* Other routes */}
          <Route path='/:login/:id/:usertype' element={<Home />} />
          <Route path="/register" element={<UserRegistration />} />
          <Route path='/login' element={<Login />} />
          <Route path='/Admin/:login/:id/:usertype' element={<Admin />} />
          <Route path='/profile/:login/:id/:usertype' element={<Profile />} />
          <Route path='/listevent/:login/:id/:usertype' element={<AddEvents />} />
          <Route path='/getOwnEvent/:login/:id/:usertype' element={<AddedEvent />} />
          <Route path='/tickets/:login/:id/:usertype' element={<Tickets />} />
          <Route path='/participants/:login/:id/:usertype/:e_id' element={<Participants/>}/>
          <Route path='/updateEvent/:login/:id/:usertype/:e_id' element={<UpdateEvent/>}/>
          <Route path='/adminallevents/:login/:id/:usertype' element={<AllEvents/>}/>
          <Route path='/allOrganizers/:login/:id/:usertype' element={<AllOrganizers/>}/>
          <Route path='/allAttendees/:login/:id/:usertype' element={<AllAttendees/>}/>

        </Routes>
      </Router>
    </>
  );
}

export default App;
