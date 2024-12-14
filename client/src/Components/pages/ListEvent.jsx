import React, { useState } from "react";
import axios from "axios";

const ListEventForm = () => {
  const [formData, setFormData] = useState({
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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file input for image upload
  const handleImageChange = (e) => {
    const files = e.target.files;
    const images = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file),
      alt: file.name,
    }));
    setFormData((prevData) => ({
      ...prevData,
      images: images,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/events", formData);
      console.log("Event created successfully:", response.data);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-4">Add Event</h2>
      <form onSubmit={handleSubmit}>
        {/* Event Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">
            Event Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full p-2 border border-gray-300 rounded"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="w-full p-2 border border-gray-300 rounded"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* Venue */}
        <div className="mb-4">
          <label htmlFor="venue" className="block text-gray-700">
            Venue
          </label>
          <input
            type="text"
            id="venue"
            name="venue"
            className="w-full p-2 border border-gray-300 rounded"
            value={formData.venue}
            onChange={handleChange}
            required
          />
        </div>

        {/* City */}
        <div className="mb-4">
          <label htmlFor="city" className="block text-gray-700">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            className="w-full p-2 border border-gray-300 rounded"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>

        {/* Start and End Date */}
        <div className="mb-4 flex space-x-4">
          <div className="w-full">
            <label htmlFor="startDate" className="block text-gray-700">
              Start Date
            </label>
            <input
              type="datetime-local"
              id="startDate"
              name="startDate"
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>
          <div className="w-full">
            <label htmlFor="endDate" className="block text-gray-700">
              End Date
            </label>
            <input
              type="datetime-local"
              id="endDate"
              name="endDate"
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Category */}
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700">
            Category
          </label>
          <select
            id="category"
            name="category"
            className="w-full p-2 border border-gray-300 rounded"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="category_id_1">Category 1</option>
            <option value="category_id_2">Category 2</option>
          </select>
        </div>

        {/* Language */}
        <div className="mb-4">
          <label htmlFor="language" className="block text-gray-700">
            Language
          </label>
          <select
            id="language"
            name="language"
            className="w-full p-2 border border-gray-300 rounded"
            value={formData.language}
            onChange={handleChange}
            required
          >
            <option value="">Select Language</option>
            <option value="language_id_1">Language 1</option>
            <option value="language_id_2">Language 2</option>
          </select>
        </div>

        {/* Ticket Price */}
        <div className="mb-4">
          <label htmlFor="ticketPrice" className="block text-gray-700">
            Ticket Price
          </label>
          <input
            type="number"
            id="ticketPrice"
            name="ticketPrice"
            className="w-full p-2 border border-gray-300 rounded"
            value={formData.ticketPrice}
            onChange={handleChange}
            required
          />
        </div>

        {/* Available Tickets */}
        <div className="mb-4">
          <label htmlFor="availableTickets" className="block text-gray-700">
            Available Tickets
          </label>
          <input
            type="number"
            id="availableTickets"
            name="availableTickets"
            className="w-full p-2 border border-gray-300 rounded"
            value={formData.availableTickets}
            onChange={handleChange}
            required
          />
        </div>

        {/* Status */}
        <div className="mb-4">
          <label htmlFor="status" className="block text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="w-full p-2 border border-gray-300 rounded"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <label htmlFor="images" className="block text-gray-700">
            Upload Event Images
          </label>
          <input
            type="file"
            id="images"
            name="images"
            className="w-full p-2 border border-gray-300 rounded"
            onChange={handleImageChange}
            multiple
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          >
            Add Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default ListEventForm;
