import React, { useState } from "react";
import api from '../../api/axios';
import PropTypes from "prop-types";

const CommissionSchemeEditModal = ({ selectedScheme, onClose, onUpdated }) => {
  const [userId] = useState(1);
  const [commissionScheme, setCommissionScheme]= useState(selectedScheme);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    const errors = [];
    setError("");

    if (!commissionScheme?.nameTag) {
      errors.push("Commission tag is required.");
    } 

    if (errors.length > 0) {
      setError(errors.join("\n"));
      return;
    }


    try {
      const { id, description, isDefault } = commissionScheme;
      const response = await api.put(`/api/v1/schemes/${id}`, {
        description,
        isDefault,
        updatedBy: userId,
      });

      const created = response.data;

      console.log("Response from server:", created);

      onUpdated(created);
      onClose();

    } catch (err) {
      console.error(err);

      const message =
        err?.response?.data ||
        err?.message ||
        "Failed to save the form. Please try again.";

      setError(message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-purple-100 p-10 w-full max-w-xl relative animate-fade-in">
        <button
          className="absolute top-5 right-6 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-3 text-gray-900">Edit Commission Scheme</h2>
        <div className="mb-8 border-b border-t pb-8 pt-3">
          <label className="block mb-2 font-semibold text-gray-800">
            Commission Tag <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            maxLength={100} 
            placeholder="Enter Commission Tag"
            className="w-full border rounded-lg p-3 text-base bg-gray-50 mb-6"
            value={commissionScheme?.nameTag ?? ""} 
            onChange={(e) => setCommissionScheme( {...commissionScheme, nameTag:e.target.value } )}
            readOnly
          />
          <label className="block mb-2 font-semibold text-gray-800">Description</label>
          <textarea
            maxLength={500} 
            placeholder="Enter Description"
            className="w-full border rounded-lg p-3 text-base bg-gray-50 mb-6"
            value={commissionScheme?.description ?? ""}
            onChange={(e) => setCommissionScheme( {...commissionScheme, description:e.target.value } )}
          />
          <label className="block mb-2 font-semibold text-gray-800">
            <input
              type="checkbox"
              checked={commissionScheme?.isDefault ?? false}
              className="accent-indigo-500"
              onChange={(e) => setCommissionScheme( {...commissionScheme, isDefault:e.target.checked } )}
            />
            &nbsp;Default Commission Scheme
          </label>
        </div>

        {error && (
          <div className="mb-4">
            <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded">
              <p className="font-bold">Error Message</p>
              <p className="whitespace-pre-line">{error}</p>
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
};

CommissionSchemeEditModal.propTypes = {
  selectedScheme: PropTypes.object.isRequired, 
  onClose: PropTypes.func.isRequired,
  onUpdated: PropTypes.func.isRequired
}

export default CommissionSchemeEditModal;
