import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AllEventsRoute from "../functionalities/AllEventsRoute";
import { FaUserCircle } from 'react-icons/fa'; // Import Font Awesome user icon

export default function NavTwo() {
  const navigate = useNavigate();
  const { login, id, usertype } = useParams();
  const [Events, setEvents] = useState([]);

  // Assuming you have a way to check if the user is logged in
  const loggedIn = true; // Replace with actual login check logic

  const handleSignin = useCallback(() => {
    navigate("/register");
  }, [navigate]);

  const handleLogin = useCallback(() => {
    navigate('/login');
  });

  const handleLogout = useCallback(() => {
    // Add your logout logic here
    navigate('/login'); // Redirect to login page after logout
  });

  const handleListEvent = useCallback(() => {
    navigate(`/listevent/${login}/${id}/${usertype}`);  // Assuming there's a route to list events for organizers
  }, [navigate]);

  useEffect(() => {
    const fetchEvents = async () => {
      const fetchedEvents = await AllEventsRoute(id);
      console.log("fetch from the nav", fetchedEvents);
      setEvents(fetchedEvents.events);
    };
    fetchEvents();
  }, [id]);

  const handleProfile = () => {
    navigate(`/profile/${login}/${id}/${usertype}`);
  }

  return (
    <>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a
            href="https://flowbite.com/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-8"
              alt="Flowbite Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              EventFlows
            </span>
          </a>
          <div className="flex md:order-2">
            {/* Conditionally render the user profile icon only if 'login' parameter is present */}
            {login && (
              <div className="ml-3" onClick={handleProfile}>
                <FaUserCircle className="text-2xl text-gray-500 dark:text-gray-400 cursor-pointer" />
              </div>
            )}
          </div>
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-search"
          >
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                  aria-current="page"
                >
                  Home
                </a>
              </li>

              {/* Conditionally render the SignUp and Login buttons if 'login' parameter is not present */}
              {!login && (
                <>
                  <li>
                    <a
                      href="#"
                      className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                      onClick={handleSignin}
                    >
                      SignUp
                    </a>
                  </li>

                  <li>
                    <a
                      href="#"
                      className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                      onClick={handleLogin}
                    >
                      Login
                    </a>
                  </li>
                </>
              )}

              {/* Conditionally render the Logout button only if the user is logged in and 'login' parameter is present */}
              {loggedIn && login && (
                <li>
                  <button
                    onClick={handleLogout}
                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    Logout
                  </button>
                </li>
              )}

              {/* Conditionally render the "List Your Event" button if usertype is "Organizer" */}
              {usertype === "Organizer" && (
                <li>
                  <button
                    onClick={handleListEvent}
                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    List Your Event
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
