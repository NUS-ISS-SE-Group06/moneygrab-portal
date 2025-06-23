import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import api from "../../api/axios";

/**
 * List of available locations for the money changer.
 * @type {string[]}
 */
const locationsList = ["Tampines", "Simei"];

/**
 * Modal component for creating a new money changer.
 * @param {Object} props
 * @param {function} props.onClose - Callback to close the modal.
 * @param {function} [props.onCreate] - Callback to handle creation success.
 * @returns {JSX.Element} The create money changer modal.
 */
const CreateMoneyChangerModal = ({ onClose, onCreate }) => {
  const [form, setForm] = useState({
    companyName: "",
    email: "",
    dateOfIncorporation: "",
    uen: "",
    address: "",
    country: "",
    postalCode: "",
    notes: "",
    scheme: "",
    role: "Money Changer Staff",
    logo: null,
    kyc: null,
    logoBase64: "",
    logoFilename: "",
    kycBase64: "",
    kycFilename: "",
  });
  const [error, setError] = useState(null);
  const [selectedLocations, setSelectedLocations] = useState([]);

  /**
   * Handles changes to form input fields.
   * @param {Object} e - The event object from the input change.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handles file input changes for logo or KYC.
   * @param {Object} e - The event object from the file input.
   * @param {string} key - The key indicating "logo" or "kyc".
   */
  const handleFileChange = (e, key) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setForm((prev) => ({
          ...prev,
          ...(key === "logo"
            ? { logo: file, logoBase64: base64String, logoFilename: file.name }
            : { kyc: file, kycBase64: base64String, kycFilename: file.name }),
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setForm((prev) => ({
        ...prev,
        ...(key === "logo"
          ? { logo: null, logoBase64: "", logoFilename: "" }
          : { kyc: null, kycBase64: "", kycFilename: "" }),
      }));
    }
  };

  const handleLocationSelect = useCallback((loc) => {
    if (!selectedLocations.includes(loc)) {
      setSelectedLocations((prev) => [...prev, loc]);
    }
  }, [selectedLocations]);

  const handleLocationDeselect = useCallback((loc) => {
    setSelectedLocations((prev) => prev.filter((l) => l !== loc));
  }, []);

  /**
   * Handles form submission to create a new money changer.
   * @param {Object} e - The event object from form submission.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.companyName || !form.email) {
      setError("Company Name and Email are required.");
      return;
    }

    try {
      const schemeIdMap = { "Scheme - 01": 1, "Scheme - 02": 2, "Scheme - 03": 3 };
      const createData = {
        ...form,
        locations: selectedLocations,
        logo: undefined,
        kyc: undefined,
        schemeId: schemeIdMap[form.scheme] || 1,
        logoBase64: form.logoBase64,
        logoFilename: form.logoFilename,
        kycBase64: form.kycBase64,
        kycFilename: form.kycFilename,
      };

      const response = await api.post("/api/v1/money-changers", createData);
      if (!response.data) {
        throw new Error(`No data received! Status: ${response.status}`);
      }
      if (onCreate) onCreate(response.data);
      setError(null);
      onClose(true);
    } catch (err) {
      setError(`Creation failed: ${err.message}`);
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
        <h2 className="text-2xl font-bold mb-6">Create Money Changer</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-gray-700">Email</label>
              <input
                className="w-full p-2 border rounded"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Company Name</label>
              <input
                className="w-full p-2 border rounded"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Role</label>
              <input
                className="w-full p-2 border rounded bg-gray-100"
                value={form.role}
                readOnly
                disabled
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Date of Incorporation</label>
              <input
                className="w-full p-2 border rounded"
                type="text"
                name="dateOfIncorporation"
                value={form.dateOfIncorporation}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">UEN</label>
              <input
                className="w-full p-2 border rounded"
                name="uen"
                value={form.uen}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Address</label>
              <textarea
                className="w-full p-2 border rounded"
                name="address"
                value={form.address}
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
                  value={form.country}
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
                  value={form.postalCode}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Notes</label>
              <textarea
                className="w-full p-2 border rounded"
                name="notes"
                value={form.notes}
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
              <label className="block font-semibold text-gray-700">Scheme</label>
              <select
                className="w-full p-2 border rounded"
                name="scheme"
                value={form.scheme}
                onChange={handleChange}
              >
                <option value="Scheme - 01">Scheme - 01</option>
                <option value="Scheme - 02">Scheme - 02</option>
                <option value="Scheme - 03">Scheme - 03</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Logo</label>
              <input
                type="file"
                accept=".jpeg,.png,.gif,.pdf"
                className="w-full p-2 border rounded"
                onChange={(e) => handleFileChange(e, "logo")}
              />
              <div className="text-xs text-gray-500">Supported: JPEG, PNG, GIF, PDF</div>
            </div>
            <div>
              <label className="block font-semibold text-gray-700">KYC</label>
              <input
                type="file"
                accept=".pdf"
                className="w-full p-2 border rounded"
                onChange={(e) => handleFileChange(e, "kyc")}
              />
              <div className="text-xs text-gray-500">Supported: PDF</div>
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
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

CreateMoneyChangerModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func,
};

CreateMoneyChangerModal.defaultProps = {
  onCreate: null,
};

export default CreateMoneyChangerModal;