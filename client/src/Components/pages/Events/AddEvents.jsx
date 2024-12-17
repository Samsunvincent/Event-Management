import AllCategoryRoute from "../../functionalities/AllCategoryRoute";
import AllLanguageRoute from "../../functionalities/AllLanguageRoute";
import AddEventRoute from "../../functionalities/AddEventRoute";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify"; // Import toastify
import AllCityRoute from "../../functionalities/AllCityRoute";

export default function AddEvents() {
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
    const { login, id, usertype } = useParams();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const token = localStorage.getItem(login);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const fetchedCategory = await AllCategoryRoute();
                console.log('fetchedCategory', fetchedCategory);
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
                console.log('fetchedLanguage', fetchedLanguage);
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
                console.log('fetchedCity', fetchedCity);
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

    const handleAddEventSubmit = useCallback(
        async (e) => {
            e.preventDefault();

            // Validation for required fields
            if (!formData.name || !formData.description || !formData.venue || !formData.city || !formData.startDate || !formData.endDate || !formData.category || !formData.language || !formData.ticketPrice || !formData.availableTickets) {
                setError("All fields are required.");
                toast.error("Please fill all required fields.", { position: "bottom-center" });
                return;
            }

            // Validation for date range
            if (new Date(formData.startDate) >= new Date(formData.endDate)) {
                setError("Start date must be earlier than end date.");
                toast.error("Start date must be earlier than end date.", { position: "bottom-center" });
                return;
            }

            // Validation for images
            if (formData.images.length === 0) {
                setError("At least one image is required.");
                toast.error("Please upload at least one image.", { position: "bottom-center" });
                return;
            }

            setLoading(true);
            setError(null);
            setSuccess(false);

            // Create a FormData object to handle both files and other form inputs
            const formDataObj = new FormData();
            Object.keys(formData).forEach((key) => {
                if (key === 'images') {
                    formData.images.forEach((file) => {
                        formDataObj.append('images[]', file);  // Append files as 'images[]'
                    });
                } else {
                    formDataObj.append(key, formData[key]);  // Append other fields
                }
            });

            try {
                await AddEventRoute(formDataObj, token, id);
                setSuccess(true);
                toast.success("Event added successfully!", { position: "bottom-center" });
                setFormData({
                    name: "",
                    description: "",
                    venue: "",
                    city: "",
                    startDate: "",
                    endDate: "",
                    category: "",
                    language: "",
                    ticketPrice: "",
                    availableTickets: "",
                    status: "Active",
                    images: [],
                });
            } catch (err) {
                console.error("Error adding event", err);
                setError("Failed to add event.");
                toast.error("Failed to add event.", { position: "bottom-center" });
            } finally {
                setLoading(false);
            }
        },
        [formData]
    );

    return (
        <>
            <div className="bg-gray-100 font-roboto">
                <div className="container mx-auto p-4">
                    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                        <h1 className="text-2xl font-bold mb-6 text-center">Add Event</h1>
                        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
                        {success && <div className="text-green-500 text-center mb-4">Event added successfully!</div>}
                        <form onSubmit={handleAddEventSubmit}>
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
                                            <option key={categoryItem._id} value={categoryItem.category}>
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
                                            <option key={languageItem._id} value={languageItem.Language}>
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

                                {/* Image Upload */}
                                <div className="mb-4">
                                    <label htmlFor="images" className="block text-gray-700 font-bold mb-2">
                                        Event Images
                                    </label>
                                    <input
                                        type="file"
                                        id="images"
                                        name="images"
                                        multiple
                                        onChange={handleFileChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="text-center">
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={loading}
                                >
                                    {loading ? "Submitting..." : "Add Event"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
