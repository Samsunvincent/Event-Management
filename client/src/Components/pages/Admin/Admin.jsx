import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Count from "../../functionalities/Admin/GetCountRoute";

export default function Admin() {
    const { login, id, usertype } = useParams();
    const [totalEvents, setTotalEvents] = useState('');
    const [totalUsers, setTotalUsers] = useState('');
    const [totalRevenue, setTotalRevenue] = useState('');
    const [recentBookings, setRecentBookings] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem(login);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const fetchedCount = await Count(token);
                console.log('fetchedCount', fetchedCount);

                if (fetchedCount && fetchedCount.data) {
                    // Update the states based on the fetched data
                    setTotalEvents(fetchedCount.data.eventCount || 0); // Total events count
                    setTotalUsers(fetchedCount.data.userCount || 0); // Total users count
                    setTotalRevenue(fetchedCount.data.totalRevenue || 0); // Total revenue

                    // Recent bookings (latest bookings)
                    const formattedBookings = fetchedCount.data.latestBookings.map(booking => ({
                        id: booking._id,
                        name: booking.eventId.name,
                        date: booking.eventId.startDate,
                        location: booking.eventId.city,
                        image: booking.eventId.images[0].url, // Assuming image URL is provided
                        EventId: booking.eventId._id,
                    }));
                    setRecentBookings(formattedBookings);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchCount();
    }, [token]);

    const handleEventDetails = useCallback((e_id) => {
        navigate(`/singleView/${login}/${id}/${usertype}/${e_id}`);
    }, [login, id, usertype, navigate]);

    const handleEvents = useCallback(() => {
        navigate(`/adminallevents/${login}/${id}/${usertype}`)
    })

    const handleOrganizer = useCallback(() => {
        navigate(`/allOrganizers/${login}/${id}/${usertype}`)
    })

    const handleAttendees = useCallback(() => {
        navigate(`/allAttendees/${login}/${id}/${usertype}`)
    })


    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow-md">
                <div className="container mx-auto px-6 py-6 flex justify-between items-center">
                    <h1 className="text-3xl font-semibold text-gray-800">Event Management Dashboard</h1>
                    <div className="flex items-center space-x-6">
                        <button className="text-gray-600 hover:text-gray-800">
                            <i className="fas fa-bell text-xl"></i>
                        </button>
                        <img
                            alt="Admin profile"
                            className="w-12 h-12 rounded-full"
                            src="https://example.com/profile.jpg"
                        />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-64 bg-white shadow-lg">
                    <div className="p-6">
                        <nav className="space-y-6">
                            <a className="flex items-center text-gray-700 hover:text-gray-900 font-medium" href="#">
                                <i className="fas fa-tachometer-alt mr-4 text-lg"></i>
                                Dashboard
                            </a>
                            <a className="flex items-center text-gray-700 hover:text-gray-900 font-medium" href="#" onClick={handleEvents}>
                                <i className="fas fa-calendar-alt mr-4 text-lg" ></i>
                                Events
                            </a>
                            <a className="flex items-center text-gray-700 hover:text-gray-900 font-medium" href="#" onClick={handleOrganizer}>
                                <i className="fas fa-users mr-4 text-lg"></i>
                                Organizers
                            </a>
                            <a className="flex items-center text-gray-700 hover:text-gray-900 font-medium" href="#" onClick={handleAttendees}>
                                <i className="fas fa-users mr-4 text-lg"></i>
                                Attendees
                            </a>
                            <a className="flex items-center text-gray-700 hover:text-gray-900 font-medium" href="#">
                                <i className="fas fa-cogs mr-4 text-lg"></i>
                                Settings
                            </a>
                            <a className="flex items-center text-gray-700 hover:text-gray-900 font-medium" href="#">
                                <i className="fas fa-sign-out-alt mr-4 text-lg"></i>
                                Logout
                            </a>
                        </nav>
                    </div>
                </aside>

                {/* Main Panel */}
                <main className="flex-1 p-6">
                    <div className="container mx-auto">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Card 1: Total Events */}
                            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                                <h3 className="text-xl font-semibold text-gray-800">Events</h3>
                                <p className="text-3xl font-bold text-gray-900">{totalEvents}</p>
                            </div>

                            {/* Card 2: Total Users */}
                            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                                <h3 className="text-xl font-semibold text-gray-800">Users</h3>
                                <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
                            </div>

                            {/* Card 3: Total Revenue */}
                            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                                <h3 className="text-xl font-semibold text-gray-800">Total Revenue</h3>
                                <p className="text-3xl font-bold text-gray-900">{totalRevenue}</p>
                            </div>
                        </div>

                        {/* Recent Bookings */}
                        <div className="mt-12">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Bookings</h2>
                            <div className="bg-white p-6 rounded-xl shadow-lg">
                                <ul className="space-y-6">
                                    {recentBookings && recentBookings.length > 0 ? (
                                        recentBookings.map((booking, index) => (
                                            <li
                                                key={index}
                                                className="flex items-center justify-between hover:bg-gray-50 rounded-lg Ddatep-3 cursor-pointer"
                                                onClick={() => handleEventDetails(booking.EventId)}
                                            >
                                                <div className="flex items-center">
                                                    {/* Image */}
                                                    {booking.image ? (
                                                        <img
                                                            src={`http://localhost:4000/${booking.image.replace(/\\/g, '/')}`}
                                                            alt={booking.name || 'Event'}
                                                            className="w-12 h-12 rounded-full mr-4"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-full bg-gray-200 mr-4 flex items-center justify-center">
                                                            <span className="text-gray-400">N/A</span>
                                                        </div>
                                                    )}

                                                    {/* Event Info */}
                                                    <div>
                                                        <p className="text-gray-800 font-semibold">{booking.name || 'Unknown Event'}</p>
                                                        <p className="text-gray-600">
                                                            {booking.date
                                                                ? new Date(booking.date).toLocaleDateString()
                                                                : 'No Date Available'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Location */}
                                                <span className="text-gray-600 text-sm">
                                                    {booking.location || 'No Location Available'}
                                                </span>
                                            </li>
                                        ))
                                    ) : (
                                        <li>No recent bookings available.</li>
                                    )}
                                </ul>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
