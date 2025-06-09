import React, { useState } from "react";
import api from "../api/axios";

const CommissionSchemeCreateModal = ({ onClose, onCreated}) => {
  const [userId, setUserId] = useState(1);
  const [nameTag, setNameTag] = useState("");
  const [description, setDescription] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setError("");

    if (!nameTag) {
      setError("Commission tag is required.");
      return;
    } 

    try {
      const response = await api.post("/api/v1/schemes", {
        nameTag,
        description,
        createdBy: userId,
        updatedBy: userId,
      });


      onCreated(response.data);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to create commission scheme.");
    }

  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-purple-100 p-10 w-full max-w-xl relative animate-fade-in">
        <button
          className="absolute top-5 right-6 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >×</button>
        <h2 className="text-2xl font-bold mb-3 text-gray-900">Create Commission Scheme</h2>
        <div className="mb-8 border-b border-t pb-8 pt-3">
              <label className="block mb-2 font-semibold text-gray-800">Commission Tag <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Enter Commission Tag"
                className="w-full border rounded-lg p-3 text-base bg-gray-50 mb-6"
                value={nameTag}
                onChange={(e) => setNameTag(e.target.value)}
              />
              <label className="block mb-2 font-semibold text-gray-800">Description </label>
              <textarea
                placeholder="Enter Description"
                className="w-full border rounded-lg p-3 text-base bg-gray-50 mb-6"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <label className="block mb-2 font-semibold text-gray-800">
                <input
                  type="checkbox"
                  checked={isDefault}
                  className="accent-indigo-500"
                  onChange={(e) => setIsDefault(e.target.checked)}
                  />
                &nbsp;Default Commission Scheme 
              </label>
        </div>

        {error && (
          <div className="mb-4">
            <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded">
              <p className="font-bold">Error Message</p>
              <p>{error}</p>
            </div>
          </div>     
        )}


        <div className="flex justify-end">
          <button
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-2 rounded-lg font-semibold"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommissionSchemeCreateModal;