import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import api from "../../api/axios";

const initialState = {
  companyName: "",
  email: "",
  dateOfIncorporation: "",
  address: "",
  country: "Singapore",
  postalCode: "",
  uen: "",
  scheme: "Scheme - 01",
  notes: "",
  logo: null,
  kyc: null,
  locations: [],
  logoBase64: "",
  logoFilename: "",
  kycBase64: "",
  kycFilename: "",
};

const locationsList = [
  "Ang Mo Kio",
  "Bedok",
  "Bishan",
  "Bukit Batok",
  "Bukit Merah",
  "Bukit Panjang",
  "Bukit Timah",
  "Central Area",
  "Choa Chu Kang",
  "Clementi",
  "Geylang",
  "Hougang",
  "Jurong East",
  "Jurong West",
  "Kallang",
  "Marine Parade",
  "Novena",
  "Pasir Ris",
  "Punggol",
  "Queenstown",
  "Sembawang",
  "Sengkang",
  "Serangoon",
  "Tampines",
  "Toa Payoh",
  "Woodlands",
  "Yishun",
];

const FileUpload = ({ label, accept, id, onChange, preview, filename }) => (
  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
    <div className="text-gray-400 mb-2">{label}</div>
    <input type="file" accept={accept} className="hidden" onChange={onChange} id={id} />
    <label
      htmlFor={id}
      className="inline-block bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 cursor-pointer"
    >
      Browse
    </label>
    <div className="text-xs text-gray-500 mt-1">Supported: {accept.replace(/\./g, ", ")}</div>
    {preview && (
      <div className="mt-2">
        <img src={preview} alt={`${label} Preview`} className="max-w-xs max-h-32 object-contain" />
      </div>
    )}
    {filename && <div className="mt-2 text-sm text-gray-700">{filename}</div>}
  </div>
);

const CreateMoneyChangerModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState(null);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [logoPreview, setLogoPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, key) => {
    const file = e.target.files?.[0];
    const fileConfig = {
      logo: {
        preview: setLogoPreview,
        updates: { logo: null, logoBase64: "", logoFilename: "" },
        setValues: (base64) => ({
          logo: file,
          logoBase64: base64,
          logoFilename: file.name,
        }),
      },
      kyc: {
        preview: null,
        updates: { kyc: null, kycBase64: "", kycFilename: "" },
        setValues: (base64) => ({
          kyc: file,
          kycBase64: base64,
          kycFilename: file.name,
        }),
      },
    };

    if (!file) {
      setForm((prev) => {
        const updates = fileConfig[key].updates;
        if (fileConfig[key].preview) fileConfig[key].preview(null);
        return { ...prev, ...updates };
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setForm((prev) => {
        const newValues = fileConfig[key].setValues(base64String);
        if (fileConfig[key].preview) fileConfig[key].preview(base64String);
        return { ...prev, ...newValues };
      });
    };
    reader.readAsDataURL(file);
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
    if (!form.companyName || !form.email || !form.dateOfIncorporation) {
      setError("Company Name, Email, and Date of Incorporation are required.");
      return;
    }

    try {
      const createData = {
        ...form,
        locations: selectedLocations,
        logo: undefined,
        kyc: undefined,
        schemeId: parseInt(form.scheme.split("-")[1]) || 1,
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
      setForm(initialState);
      onClose();
    } catch (err) {
      setError(`Creation failed: ${err.response?.status || err.message}`);
      console.error("Create error:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <form
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 relative"
        onSubmit={handleSubmit}
      >
        <button
          type="button"
          onClick={() => onClose()}
          className="absolute right-4 top-4 text-2xl text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-700">Create Money Changer</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-gray-700">Company Name</label>
              <input
                className="w-full p-2 border rounded"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                placeholder="Company name"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Email</label>
              <input
                className="w-full p-2 border rounded"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email address"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Date of Incorporation</label>
              <input
                className="w-full p-2 border rounded"
                type="date"
                name="dateOfIncorporation"
                value={form.dateOfIncorporation}
                onChange={handleChange}
                required
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
                placeholder="Address"
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
                placeholder="Notes"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-semibold text-gray-700">Location List</label>
                <div className="bg-gray-50 p-2 rounded h-24 overflow-y-auto">
                  {locationsList
                    .filter((l) => !selectedLocations.includes(l))
                    .map((loc) => (
                      <div key={loc} className="flex justify-between p-1">
                        <span className="text-sm text-gray-700">{loc}</span>
                        <button
                          type="button"
                          className="text-indigo-600 underline text-sm"
                          onClick={() => handleLocationSelect(loc)}
                        >
                          Select
                        </button>
                      </div>
                    ))}
                </div>
              </div>
              <div className="flex-1">
                <label className="block font-semibold text-gray-700">Selected Locations</label>
                <div className="bg-gray-50 p-2 rounded h-24 overflow-y-auto">
                  {selectedLocations.map((loc) => (
                    <div key={loc} className="flex justify-between p-1">
                      <span className="text-sm text-gray-700">{loc}</span>
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
              <label className="block font-semibold text-gray-700">UEN</label>
              <input
                className="w-full p-2 border rounded"
                name="uen"
                value={form.uen}
                onChange={handleChange}
                placeholder="UEN"
              />
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
                <option value="Scheme - 04">Scheme - 04</option>
                <option value="Scheme - 05">Scheme - 05</option>
                <option value="Scheme - 06">Scheme - 06</option>
                <option value="Scheme - 07">Scheme - 07</option>
                <option value="Scheme - 08">Scheme - 08</option>
                <option value="Scheme - 09">Scheme - 09</option>
                <option value="Scheme - 10">Scheme - 10</option>
              </select>
            </div>
            <FileUpload
              label="Upload Logo"
              accept=".jpeg,.png,.gif"
              id="logo-upload"
              onChange={(e) => handleFileChange(e, "logo")}
              preview={logoPreview}
              filename={form.logoFilename}
            />
            <FileUpload
              label="Upload KYC"
              accept=".pdf"
              id="kyc-upload"
              onChange={(e) => handleFileChange(e, "kyc")}
              preview={null}
              filename={form.kycFilename}
            />
          </div>
        </div>
        {error && (
          <div className="bg-yellow-100 text-red-700 p-3 mt-4 rounded">
            <strong>Error</strong>
            <p>{error}</p>
          </div>
        )}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-indigo-500 text-white px-6 py-2 rounded shadow hover:bg-indigo-600 transition"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

CreateMoneyChangerModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default CreateMoneyChangerModal;