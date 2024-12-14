import React, { useEffect, useState } from "react";
import Nav from "../../Nav/Nav";
import AllEventsRoute from "../../functionalities/AllEventsRoute";
import { useNavigate, useParams } from "react-router-dom";
import AllCategoryRoute from "../../functionalities/AllCategoryRoute";
import AllLanguageRoute from "../../functionalities/AllLanguageRoute";
import AllCityRoute from "../../functionalities/AllCityRoute";
import Footer from "../../Footer/Footer";
import FilterEventsRoute from "../../functionalities/FilterEventsRoute";

export default function Home() {
    const { login, id, usertype } = useParams();
    const [events, setEvents] = useState([]);
    const [category, setCategory] = useState([]);
    const [language, setLanguage] = useState([]);
    const [city, setCity] = useState([]);
    const token = localStorage.getItem(login);
    const navigate = useNavigate()

    // Track the selected filters
    const [selectedLanguage, setSelectedLanguage] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [selectedCity, setSelectedCity] = useState([]);

    // Track which filter section is open
    const [openFilter, setOpenFilter] = useState(null);

    // Fetch all events initially
    useEffect(() => {
        const fetchEvents = async () => {
            const data = await AllEventsRoute(id);
            setEvents(data.events || []); // Ensure proper response structure
        };
        fetchEvents();
    }, [id]);

    // Fetch Categories
    useEffect(() => {
        const fetchCategory = async () => {
            const fetchedCategory = await AllCategoryRoute();
            setCategory(fetchedCategory.data || []); // Ensure proper response structure
        };
        fetchCategory();
    }, []);

    // Fetch Languages
    useEffect(() => {
        const fetchLanguage = async () => {
            const fetchedLanguage = await AllLanguageRoute();
            setLanguage(fetchedLanguage.data || []); // Ensure proper response structure
        };
        fetchLanguage();
    }, []);

    // Fetch Cities
    useEffect(() => {
        const fetchCity = async () => {
            const fetchedCity = await AllCityRoute();
            setCity(fetchedCity.getCity || []); // Ensure proper response structure
        };
        fetchCity();
    }, []);

    // Handle filter toggle
    const handleFilterToggle = (filterName) => {
        setOpenFilter((prev) => (prev === filterName ? null : filterName));
    };

    // Handle filter selection
    const handleFilterSelect = (filterType, value) => {
        if (filterType === "language") {
            setSelectedLanguage((prev) => {
                if (prev.includes(value)) {
                    return prev.filter((item) => item !== value); // Remove if already selected
                }
                return [...prev, value]; // Add if not selected
            });
        } else if (filterType === "category") {
            setSelectedCategory((prev) => {
                if (prev.includes(value)) {
                    return prev.filter((item) => item !== value); // Remove if already selected
                }
                return [...prev, value]; // Add if not selected
            });
        } else if (filterType === "city") {
            setSelectedCity((prev) => {
                if (prev.includes(value)) {
                    return prev.filter((item) => item !== value); // Remove if already selected
                }
                return [...prev, value]; // Add if not selected
            });
        }
    };

    // Fetch filtered events based on selected filters
    useEffect(() => {
        const fetchFilteredEvents = async () => {
            const query = {};
            if (selectedLanguage.length > 0) {
                query.language = selectedLanguage.join(",");
            }
            if (selectedCategory.length > 0) {
                query.category = selectedCategory.join(",");
            }
            if (selectedCity.length > 0) {
                query.city = selectedCity.join(",");
            }

            const filteredData = await FilterEventsRoute(query, token);
            if (filteredData) {
                setEvents(filteredData.data?.events || []); // Ensure proper response structure
            }
        };

        if (selectedLanguage.length || selectedCategory.length || selectedCity.length) {
            fetchFilteredEvents();
        } else {
            const fetchEvents = async () => {
                const data = await AllEventsRoute(id);
                setEvents(data.events || []); // Ensure proper response structure
            };
            fetchEvents();
        }
    }, [selectedLanguage, selectedCategory, selectedCity, id, token]);

    const handleSingleView = (e_id) =>{
        navigate(`/singleView/${login}/${id}/${usertype}/${e_id}`)
    }

    return (
        <>
            <Nav />
            <div className="flex mt-8 px-6">
                {/* Sidebar Section */}
                <div className="w-1/5 pr-6">
                    <h2 className="text-2xl font-bold mb-4">Filters</h2>

                    {/* Languages Filter */}
                    <div className="mb-6 border-b">
                        <div
                            className="flex justify-between items-center cursor-pointer"
                            onClick={() => handleFilterToggle("languages")}
                        >
                            <h4 className="text-lg font-semibold mb-2">Languages</h4>
                            <button className="text-gray-600">▼</button>
                        </div>
                        {openFilter === "languages" && (
                            <div className="flex flex-wrap gap-4">
                                {language.map((lang, index) => (
                                    <div
                                        key={index}
                                        className={`text-gray-700 hover:text-black cursor-pointer border border-gray-300 rounded px-2 py-1 ${selectedLanguage.includes(lang.Language) ? "bg-blue-200" : ""}`}
                                        onClick={() => handleFilterSelect("language", lang.Language)}
                                    >
                                        {lang.Language}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Categories Filter */}
                    <div className="mb-6 border-b">
                        <div
                            className="flex justify-between items-center cursor-pointer"
                            onClick={() => handleFilterToggle("categories")}
                        >
                            <h4 className="text-lg font-semibold mb-2">Categories</h4>
                            <button className="text-gray-600">▼</button>
                        </div>
                        {openFilter === "categories" && (
                            <div className="flex flex-wrap gap-4">
                                {category.map((cat, index) => (
                                    <div
                                        key={index}
                                        className={`text-gray-700 hover:text-black cursor-pointer border border-gray-300 rounded px-2 py-1 ${selectedCategory.includes(cat.Category) ? "bg-blue-200" : ""}`}
                                        onClick={() => handleFilterSelect("category", cat.Category)}
                                    >
                                        {cat.Category}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Cities Filter */}
                    <div className="mb-6 border-b">
                        <div
                            className="flex justify-between items-center cursor-pointer"
                            onClick={() => handleFilterToggle("cities")}
                        >
                            <h4 className="text-lg font-semibold mb-2">Cities</h4>
                            <button className="text-gray-600">▼</button>
                        </div>
                        {openFilter === "cities" && (
                            <div className="flex flex-wrap gap-4">
                                {city.map((c, index) => (
                                    <div
                                        key={index}
                                        className={`text-gray-700 hover:text-black cursor-pointer border border-gray-300 rounded px-2 py-1 ${selectedCity.includes(c.City) ? "bg-blue-200" : ""}`}
                                        onClick={() => handleFilterSelect("city", c.City)}
                                    >
                                        {c.City}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Events Section */}
                <div className="w-4/5">
                    <h2 className="text-3xl font-bold mb-6">Events</h2>
                    {events.length === 0 ? (
                        <p>No events found based on the selected filters.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {events.map((event, index) => (
                                <div
                                    key={index}
                                    className="border rounded-lg shadow-md overflow-hidden"
                                    onClick={() =>handleSingleView(event._id)}
                                >
                                    <img
                                        src={
                                            event.images[0]?.url
                                                ? `http://localhost:4000/${event.images[0].url}`
                                                : "https://via.placeholder.com/300"
                                        }
                                        alt={event.images[0]?.alt || "Event Image"}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4" >
                                        <h4 className="text-lg font-bold mb-2">{event.name}</h4>
                                        <p className="text-gray-600 mb-2">{event.description.slice(0,80) + "..."}</p>
                                        <p className="text-gray-500 mb-2">{event.city}</p>
                                        <p className="font-bold mt-2 text-red-500">
                                            ₹ {event.ticketPrice || "Free"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="pt-6">
                <Footer />
            </div>
        </>
    );
}
