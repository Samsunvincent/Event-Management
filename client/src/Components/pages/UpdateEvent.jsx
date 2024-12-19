import AllCategoryRoute from "../functionalities/AllCategoryRoute";
import AllLanguageRoute from "../functionalities/AllLanguageRoute";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify"; // Import toastify
import AllCityRoute from "../functionalities/AllCityRoute";
import SingleViewRoute from "../functionalities/SingleViewRoute";
import UpdateEventRoute from "../functionalities/UpdateEventRoute";

export default function UpdateEvent() {
    const [category, setCategory] = useState([]);
    const [language, setLanguage] = useState([]);
    const [city, setCity] = useState([]); // Initialize city state
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        venue: "",
        city: "", // city field in form data
        startDate: "",
        endDate: "",
        category: "",
        language: "",
        ticketPrice: "",
        availableTickets: "",
        status: "Active",
        images: [],
    });
    const { login, id, usertype, e_id } = useParams();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const token = localStorage.getItem(login);
    const [singleData, setSingleData] = useState();

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const fetchedCategory = await AllCategoryRoute();
                setCategory(fetchedCategory.data);
            } catch (err) {
                console.error("Error fetching categories", err);
                setError("Failed to fetch categories.");
            }
        };
        fetchCategory();
    }, []);

    useEffect(() => {
        const fetchLanguage = async () => {
            try {
                const fetchedLanguage = await AllLanguageRoute();
                setLanguage(fetchedLanguage.data);
            } catch (err) {
                console.error("Error fetching languages", err);
                setError("Failed to fetch languages.");
            }
        };
        fetchLanguage();
    }, []);

    useEffect(() => {
        const fetchCity = async () => {
            try {
                const fetchedCity = await AllCityRoute();
                setCity(fetchedCity.getCity); // Assuming the cities are in `getCity`
            } catch (err) {
                console.error("Error fetching city", err);
                setError("Failed to fetch city.");
            }
        };
        fetchCity();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter((file) =>
            ["image/jpeg", "image/png", "image/jpg"].includes(file.type)
        );
        if (validFiles.length !== files.length) {
            setError("Some files are not valid images.");
        } else {
            setError(null);
        }
        setFormData({ ...formData, images: validFiles });
    };

    useEffect(() => {
        const fetchSingleData = async () => {
            const fetchedData = await SingleViewRoute(e_id, id);
            setSingleData(fetchedData.data); // Updated to match the correct structure
            // Set formData with the fetched data
            if (fetchedData.data) {
                setFormData({
                    name: fetchedData.data.event.name,
                    description: fetchedData.data.event.description,
                    venue: fetchedData.data.event.venue,
                    city: fetchedData.data.event.city,
                    startDate: fetchedData.data.event.startDate.split('T')[0], // Format date to match input type
                    endDate: fetchedData.data.event.endDate.split('T')[0],
                    category: fetchedData.data.category.Category,
                    language: fetchedData.data.language.Language,
                    ticketPrice: fetchedData.data.event.ticketPrice,
                    availableTickets: fetchedData.data.event.availableTickets,
                    status: fetchedData.data.event.status,
                    images: fetchedData.data.event.images || [], // Handle images array
                });
            }
        };
        fetchSingleData();
    }, [e_id, id]);

    const handleUpdateEventSubmit = useCallback(async (e) => {
        e.preventDefault(); // Prevent form submission from refreshing the page
    
        // Validate required fields
        if (!formData.name || !formData.description || !formData.venue || !formData.city || !formData.startDate || !formData.endDate || !formData.category) {
            setError("Please fill in all required fields.");
            return;
        }
    
        // Prepare the form data to be sent
        const body = {
            name: formData.name,
            description: formData.description,
            venue: formData.venue,
            city: formData.city,
            startDate: formData.startDate,
            endDate: formData.endDate,
            category: formData.category,  // Send the category name as a string
            language: formData.language,
            ticketPrice: formData.ticketPrice,
            availableTickets: formData.availableTickets,
            status: formData.status,
            images: formData.images, // Assuming the images are already processed
        };
    
        // Set loading state
        setLoading(true);
    
        try {
            const updateEvent = await UpdateEventRoute(body, e_id, token);
    
            if (updateEvent.status === 200 && updateEvent.data.message) {
                // Show success toast with the message from the server response
                toast.success(updateEvent.data.message || "Event updated successfully!");
                setSuccess(true);
            } else {
                // Fallback error message
                setError(updateEvent.data.message || "Error updating event.");
                toast.error(updateEvent.data.message || "Failed to update event.");
            }
        } catch (error) {
            console.error("Error updating event:", error);
            setError("Error updating event.");
            toast.error("Failed to update event.");
        } finally {
            setLoading(false);
        }
    }, [formData, e_id, token]);

    return (
        <>
            <div className="bg-gray-100 font-roboto">
                <div className="container mx-auto p-4">
                    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                        <h1 className="text-2xl font-bold mb-6 text-center">Update Event</h1>
                        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
                        {success && <div className="text-green-500 text-center mb-4">Event updated successfully!</div>}
                        <form onSubmit={handleUpdateEventSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Name */}
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                                        Event Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Description */}
                                <div className="mb-4">
                                    <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
                                        Event Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Venue */}
                                <div className="mb-4">
                                    <label htmlFor="venue" className="block text-gray-700 font-bold mb-2">
                                        Venue
                                    </label>
                                    <input
                                        type="text"
                                        id="venue"
                                        name="venue"
                                        value={formData.venue}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* City Dropdown */}
                                <div className="mb-4">
                                    <label htmlFor="city" className="block text-gray-700 font-bold mb-2">
                                        City
                                    </label>
                                    <select
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="" disabled>Select a city</option>
                                        {city.map((cityItem) => (
                                            <option key={cityItem._id} value={cityItem.City}>
                                                {cityItem.City}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Start Date */}
                                <div className="mb-4">
                                    <label htmlFor="startDate" className="block text-gray-700 font-bold mb-2">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        id="startDate"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* End Date */}
                                <div className="mb-4">
                                    <label htmlFor="endDate" className="block text-gray-700 font-bold mb-2">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        id="endDate"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Category Dropdown */}
                                <div className="mb-4">
                                    <label htmlFor="category" className="block text-gray-700 font-bold mb-2">
                                        Category
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="" disabled>Select a category</option>
                                        {category.map((categoryItem) => (
                                            <option key={categoryItem._id} value={categoryItem.Category}>  
                                                {categoryItem.Category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Language Dropdown */}
                                <div className="mb-4">
                                    <label htmlFor="language" className="block text-gray-700 font-bold mb-2">
                                        Language
                                    </label>
                                    <select
                                        id="language"
                                        name="language"
                                        value={formData.language}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="" disabled>Select a language</option>
                                        {language.map((languageItem) => (
                                            <option key={languageItem._id} value={languageItem._id}>
                                                {languageItem.Language}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Ticket Price */}
                                <div className="mb-4">
                                    <label htmlFor="ticketPrice" className="block text-gray-700 font-bold mb-2">
                                        Ticket Price
                                    </label>
                                    <input
                                        type="number"
                                        id="ticketPrice"
                                        name="ticketPrice"
                                        value={formData.ticketPrice}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Available Tickets */}
                                <div className="mb-4">
                                    <label htmlFor="availableTickets" className="block text-gray-700 font-bold mb-2">
                                        Available Tickets
                                    </label>
                                    <input
                                        type="number"
                                        id="availableTickets"
                                        name="availableTickets"
                                        value={formData.availableTickets}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Status */}
                                <div className="mb-4">
                                    <label htmlFor="status" className="block text-gray-700 font-bold mb-2">
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>

                                {/* Image Upload */}
                                <div className="mb-4">
                                    <label htmlFor="images" className="block text-gray-700 font-bold mb-2">
                                        Upload Images
                                    </label>
                                    <input
                                        type="file"
                                        id="images"
                                        name="images"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {error && <div className="text-red-500">{error}</div>}
                                </div>

                                {/* Submit Button */}
                                <div className="mb-4">
                                    <button
                                        type="submit"
                                        className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-blue-700"
                                        disabled={loading}
                                    >
                                        {loading ? "Updating..." : "Update Event"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
