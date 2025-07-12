import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import api from "../../api/axios";

/**
 * Modal component for creating a new money changer.
 * @param {Object} props
 * @param {function} props.onClose - Callback to close the modal.
 * @param {function} [props.onSave] - Callback to handle creation success.
 * @returns {JSX.Element} The create money changer modal.
 */
const CreateMoneyChangerModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    companyName: "",
    email: "",
    dateOfIncorporation: "",
    uen: "",
    address: "",
    country: "",
    postalCode: "",
    notes: "",
    schemeId: "",
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
  const [locations, setLocations] = useState([]);
  const [schemes, setSchemes] = useState([]);

  useEffect(() => {
    let isActive = true;
    const fetchData = async () => {
      try {
        const [locationsRes, schemesRes] = await Promise.all([
          api.get("/api/v1/locations"),
          api.get("/api/v1/schemes"),
        ]);
        if (!isActive) return;
        setLocations(locationsRes.data.filter(loc => !loc.isDeleted) || []);
        setSchemes(schemesRes.data.filter(scheme => !scheme.isDeleted) || []);
      } catch (err) {
        if (isActive) {
          setError(`Failed to fetch data: ${err.response?.status || err.message}`);
          // Fallback to hardcoded locations matching LocationDTO
          setLocations([
            { id: 1, locationName: "Tampines", countryCode: "SG" },
            { id: 2, locationName: "Simei", countryCode: "SG" },
            { id: 3, locationName: "Bedok", countryCode: "SG" },
            { id: 4, locationName: "Punggol", countryCode: "SG" },
            { id: 5, locationName: "Pasir Ris", countryCode: "SG" },
            { id: 6, locationName: "Changi", countryCode: "SG" },
            { id: 7, locationName: "Serangoon", countryCode: "SG" },
            { id: 8, locationName: "Hougang", countryCode: "SG" },
            { id: 9, locationName: "Kallang", countryCode: "SG" },
            { id: 10, locationName: "Geylang", countryCode: "SG" },
          ]);
        }
      }
    };

    fetchData();
    return () => {
      isActive = false;
    };
  }, []);

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

  const handleLocationSelect = useCallback((e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value, 10));
    const newSelections = selectedOptions.filter(id => !selectedLocations.includes(id));
    setSelectedLocations((prev) => [...prev, ...newSelections]);
  }, [selectedLocations]);

  const handleLocationDeselect = useCallback((locId) => {
    setSelectedLocations((prev) => prev.filter((l) => l !== parseInt(locId, 10)));
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
      const createData = {
        ...form,
        locations: selectedLocations,
        logo: undefined,
        kyc: undefined,
        logoBase64: form.logoBase64,
        logoFilename: form.logoFilename,
        kycBase64: form.kycBase64,
        kycFilename: form.kycFilename,
      };

      const response = await api.post("/api/v1/money-changers", createData);
      if (!response.data) {
        throw new Error(`No data received! Status: ${response.status}`);
      }
      if (onSave) onSave(response.data);
      setError(null);
      onClose(true);
    } catch (err) {
      setError(`Creation failed: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <form
        data-testid="moneychanger-form"
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 relative"
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
              <label htmlFor="email" className="block font-semibold text-gray-700">Email</label>
              <input
                id="email"
                className="w-full p-2 border rounded"
                name="email"
                value={form.email}
                placeholder="Email"
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="companyName" className="block font-semibold text-gray-700">Company Name</label>
              <input
                id="companyName"
                className="w-full p-2 border rounded"
                name="companyName"
                value={form.companyName}
                placeholder="Company name"
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="role" className="block font-semibold text-gray-700">Role</label>
              <input
                id="role"
                className="w-full p-2 border rounded bg-gray-100"
                value={form.role}
                readOnly
                disabled
              />
            </div>
            <div>
              <label htmlFor="dateOfIncorporation" className="block font-semibold text-gray-700">Date of Incorporation</label>
              <input
                id="dateOfIncorporation"
                className="w-full p-2 border rounded"
                type="date"
                name="dateOfIncorporation"
                value={form.dateOfIncorporation}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="uen" className="block font-semibold text-gray-700">UEN</label>
              <input
                id="uen"
                className="w-full p-2 border rounded"
                name="uen"
                value={form.uen}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="address" className="block font-semibold text-gray-700">Address</label>
              <textarea
                id="address"
                className="w-full p-2 border rounded"
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={2}
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="country" className="block font-semibold text-gray-700">Country</label>
                <select
                  id="country"
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
                <label htmlFor="postalCode" className="block font-semibold text-gray-700">Postal Code</label>
                <input
                  id="postalCode"
                  className="w-full p-2 border rounded"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="notes" className="block font-semibold text-gray-700">Notes</label>
              <textarea
                id="notes"
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
              <label htmlFor="locations" className="block font-semibold text-gray-700">Locations</label>
              <fieldset id="locations" className="flex gap-2">
                <div className="flex-1">
                  <select
                    multiple
                    className="w-full p-2 border rounded h-32 overflow-y-auto"
                    onChange={handleLocationSelect}
                  >
                    {locations
                      .filter((loc) => !loc.isDeleted && !selectedLocations.includes(loc.id))
                      .map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.locationName} ({loc.countryCode})
                        </option>
                      ))}
                  </select>
                </div>
                <div className="flex-1 bg-gray-100 p-2 rounded">
                  <div className="text-sm font-semibold mb-1">Selected</div>
                  {selectedLocations.map((locId) => {
                    const loc = locations.find((l) => l.id === locId);
                    return loc ? (
                      <div key={loc.id} className="flex justify-between p-1">
                        <span>{loc.locationName} ({loc.countryCode})</span>
                        <button
                          type="button"
                          className="text-red-500 underline text-sm"
                          onClick={() => handleLocationDeselect(loc.id)}
                        >
                          Deselect
                        </button>
                      </div>
                    ) : null;
                  })}
                  {selectedLocations.length === 0 && (
                    <div className="text-gray-400 text-sm">None selected</div>
                  )}
                </div>
              </fieldset>
            </div>
            <div>
              <label htmlFor="schemeId" className="block font-semibold text-gray-700">Scheme</label>
              <select
                id="schemeId"
                className="w-full p-2 border rounded"
                name="schemeId"
                value={form.schemeId}
                onChange={handleChange}
              >
                <option value="">Select a scheme</option>
                {schemes
                  .filter((scheme) => !scheme.isDeleted)
                  .map((scheme) => (
                    <option key={scheme.id} value={scheme.id}>
                      {scheme.nameTag}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label htmlFor="logo" className="block font-semibold text-gray-700">Logo</label>
              <input
                id="logo"
                type="file"
                accept=".jpeg,.png,.gif,.pdf"
                className="w-full p-2 border rounded"
                onChange={(e) => handleFileChange(e, "logo")}
              />
              <div className="text-xs text-gray-500">Supported: JPEG, PNG, GIF, PDF</div>
            </div>
            <div>
              <label htmlFor="kyc" className="block font-semibold text-gray-700">KYC</label>
              <input
                id="kyc"
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
  onSave: PropTypes.func,
};

CreateMoneyChangerModal.defaultProps = {
  onSave: null,
};

export default CreateMoneyChangerModal;