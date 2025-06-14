import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import api from '../../api/axios';

const locationsList = ["Tampines", "Simei"];

const EditMoneyChangerModal = ({ onClose, data, onUpdate }) => {
  const [form, setForm] = useState({
    ...data,
    logo: null,
    kyc: null,
  });
  const [error, setError] = useState(null);
  const [selectedLocations, setSelectedLocations] = useState(data.locations || []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, key) => {
    setForm((prev) => ({ ...prev, [key]: e.target.files[0] }));
  };

  const handleLocationSelect = useCallback((loc) => {
    if (!selectedLocations.includes(loc)) {
      setSelectedLocations((prev) => [...prev, loc]);
    }
  }, [selectedLocations]);

  const handleLocationDeselect = useCallback((loc) => {
    setSelectedLocations((prev) => prev.filter((l) => l !== loc));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.companyName || !form.email) {
      setError("Company Name and Email are required.");
      return;
    }

    try {
      const updateData = {
        ...form,
        locations: selectedLocations,
        logo: undefined,
        kyc: undefined,
      };

      const response = await api.put(`/api/v1/money-changers/${data.id}`, updateData);
      if (!response.data) {
        throw new Error(`No data received! Status: ${response.status}`);
      }
      const result = response.data;
      if (onUpdate) onUpdate(result);
      setError(null);
      onClose(true);
    } catch (err) {
      setError(`Update failed: ${err.message}`);
      console.error("Update error:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <form
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-8 relative"
        onSubmit={handleSubmit}
      >
        <button
          type="button"
          onClick={() => onClose(false)}
          className="absolute right-6 top-6 text-2xl text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-6">Edit Money Changer</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-gray-700">Email</label>
              <input
                className="w-full p-2 border rounded bg-gray-100"
                name="email"
                value={form.email || ""}
                readOnly
                disabled
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Company Name</label>
              <input
                className="w-full p-2 border rounded bg-gray-100"
                name="companyName"
                value={form.companyName || ""}
                readOnly
                disabled
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Role</label>
              <input
                className="w-full p-2 border rounded bg-gray-100"
                value={form.role || "Money Changer Staff"}
                readOnly
                disabled
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Date of Incorporation</label>
              <input
                className="w-full p-2 border rounded bg-gray-100"
                type="text"
                value={form.dateOfIncorporation || ""}
                readOnly
                disabled
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">UEN</label>
              <input
                className="w-full p-2 border rounded"
                name="uen"
                value={form.uen || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Address</label>
              <textarea
                className="w-full p-2 border rounded"
                name="address"
                value={form.address || ""}
                onChange={handleChange}
                rows={2}
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-semibold text-gray-700">Country</label>
                <select
                  className="w-full p-2 border rounded"
                  name="country"
                  value={form.country || ""}
                  onChange={handleChange}
                >
                  <option>Singapore</option>
                  <option>Malaysia</option>
                  <option>India</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block font-semibold text-gray-700">Postal Code</label>
                <input
                  className="w-full p-2 border rounded"
                  name="postalCode"
                  value={form.postalCode || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Notes</label>
              <textarea
                className="w-full p-2 border rounded"
                name="notes"
                value={form.notes || ""}
                onChange={handleChange}
                rows={2}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-gray-700">Locations</label>
              <div className="flex gap-2">
                <div className="flex-1 bg-gray-50 p-2 rounded">
                  {locationsList
                    .filter((l) => !selectedLocations.includes(l))
                    .map((loc) => (
                      <div key={loc} className="flex justify-between p-1">
                        <span>{loc}</span>
                        <button
                          type="button"
                          className="text-blue-600 underline text-sm"
                          onClick={() => handleLocationSelect(loc)}
                        >
                          Select
                        </button>
                      </div>
                    ))}
                </div>
                <div className="flex-1 bg-gray-100 p-2 rounded">
                  <div className="text-sm font-semibold mb-1">Selected</div>
                  {selectedLocations.map((loc) => (
                    <div key={loc} className="flex justify-between p-1">
                      <span>{loc}</span>
                      <button
                        type="button"
                        className="text-red-500 underline text-sm"
                        onClick={() => handleLocationDeselect(loc)}
                      >
                        Deselect
                      </button>
                    </div>
                  ))}
                  {selectedLocations.length === 0 && (
                    <div className="text-gray-400 text-sm">None selected</div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Schema</label>
              <select
                className="w-full p-2 border rounded"
                name="schema"
                value={form.schema || ""}
                onChange={handleChange}
              >
                <option>Scheme - 01</option>
                <option>Scheme - 02</option>
                <option>Scheme - 03</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Logo</label>
              <input
                type="file"
                accept=".jpg,.png,.gif,.pdf"
                className="w-full p-2 border rounded"
                onChange={(e) => handleFileChange(e, "logo")}
              />
              <div className="text-xs text-gray-500">Supported: JPG, PNG, GIF, PDF</div>
            </div>
            <div>
              <label className="block font-semibold text-gray-700">KYC</label>
              <input
                type="file"
                accept=".jpg,.png,.gif,.pdf"
                className="w-full p-2 border rounded"
                onChange={(e) => handleFileChange(e, "kyc")}
              />
              <div className="text-xs text-gray-500">Supported: JPG, PNG, GIF, PDF</div>
            </div>
          </div>
        </div>
        {error && (
          <div className="bg-yellow-100 text-red-700 p-3 mt-6 rounded">
            <strong>Error</strong>
            <p>{error}</p>
          </div>
        )}
        <div className="flex justify-end mt-8">
          <button
            type="submit"
            className="bg-indigo-500 text-white px-6 py-2 rounded shadow hover:bg-indigo-600 transition"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

EditMoneyChangerModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func,
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
    companyName: PropTypes.string,
    email: PropTypes.string,
    dateOfIncorporation: PropTypes.string,
    uen: PropTypes.string,
    address: PropTypes.string,
    country: PropTypes.string,
    postalCode: PropTypes.string,
    notes: PropTypes.string,
    schema: PropTypes.string,
    role: PropTypes.string,
    locations: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default EditMoneyChangerModal;