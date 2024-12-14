import { useEffect, useState } from "react";
import Nav from "../Nav/Nav";
import SingleViewRoute from "../functionalities/SingleViewRoute";
import { useParams } from "react-router-dom";

export default function SingleView() {
  const { e_id } = useParams();
  const [singleView, setSingleView] = useState(null); // Use null for initial state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState();
  const [language, setLanguage] = useState();
  const [relatedEvents, setRelatedEvents] = useState([]); // State for related events

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await SingleViewRoute(e_id); // Assume this returns the full response object
        setSingleView(response.data.event);
        setCategory(response.data.category);
        setLanguage(response.data.language);
        setRelatedEvents(response.data.similarEvents)

        // Fetch related events based on the category or other criteria
      
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [e_id]);

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gray-100 py-6">
        {/* Loading State */}
        {loading && (
          <div className="text-center text-gray-600 text-lg">Loading...</div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center text-red-600 text-lg">{error}</div>
        )}

        {/* Event Card */}
        {singleView && (
          <div className="max-w-6xl mx-auto border border-gray-300 rounded-lg overflow-hidden shadow-md bg-white">
            {/* Event Image */}
            <div>
              <img
                src={`http://localhost:4000/${singleView.images[0]?.url || "https://via.placeholder.com/600x300"}`}
                alt={singleView.images[0]?.alt || "Event Image"}
                className="w-full h-64"
              />
            </div>

            {/* Event Details */}
            <div className="p-4">
              <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
                {singleView.name || "Event Title"}
              </h2>
              <p className="text-gray-600 text-sm md:text-base mb-4">
                {category.Category || "Category"} |{" "}
                {language.Language || "Language"} |{" "}
                {singleView.ageLimit || "All Ages"} |{" "}
                {singleView.duration || "Duration N/A"}
              </p>

              {/* Divider */}
              <hr className="my-4 border-t border-gray-200" />

              {/* Event Details */}
              <div className="flex flex-col md:flex-row md:justify-between text-gray-700 text-sm md:text-base">
                <div>
                  <strong>{singleView.date || "Date Not Available"}</strong>
                </div>
                <div className="mt-2 md:mt-0 flex items-center">
                  <span className="text-yellow-500 mr-1">📍</span>
                  <span>{singleView.venue} : {singleView.city || "Location Not Available"}</span>
                </div>
                <div className="mt-2 md:mt-0">
                  ₹ {singleView.ticketPrice || "N/A"}{" "}
                  <small className="text-gray-500">onwards</small>
                </div>
              </div>

              {/* Filling Fast Tag */}
              {singleView.status === "filling fast" && (
                <div className="mt-4">
                  <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                    FILLING FAST
                  </span>
                </div>
              )}

              {/* Book Button */}
              <div className="mt-6 text-right">
                <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-2 rounded">
                  Book
                </button>
              </div>
            </div>

            {/* About the Event Section */}
            <div className="p-4 mt-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">About the Event</h3>
              <p className="text-gray-700 text-sm md:text-base">
                {singleView.description || "No description available for this event."}
              </p>
            </div>

            {/* You May Also Like Section */}
            <div className="p-4 mt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">You May Also Like</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {relatedEvents.map((event) => (
                  <div key={event._id} className="border border-gray-300 rounded-lg shadow-sm bg-white">
                    <img
                      src={`http://localhost:4000/${event.images[0]?.url || "https://via.placeholder.com/600x300"}`}
                      alt={event.images[0]?.alt || "Event Image"}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="p-4">
                      <h4 className="text-lg font-semibold text-gray-800">{event.name}</h4>
                      <p className="text-gray-600 text-sm">{event.category}</p>
                      <div className="mt-2 text-right">
                        <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-2 rounded">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </>
  );
}