import React, { useState } from "react";

const BlockUnblockModal = ({ isOpen, onClose, onSubmit }) => {
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (description) {
      onSubmit(description); // Pass description to parent component
    } else {
      alert("Description is required");
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
      <div className="bg-white rounded p-6 w-1/3">
        <h3 className="text-lg font-semibold">Add Description</h3>
        <textarea
          className="w-full mt-2 p-2 border border-gray-300 rounded"
          placeholder="Enter description for blocking/unblocking"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="mt-4 flex justify-end space-x-2">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default BlockUnblockModal;
