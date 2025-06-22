import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import api from "../../api/axios";

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
  <div>
    <label className="block font-semibold text-gray-700">{label}</label>
    <input
      type="file"
      accept={accept}
      className="w-full p-2 border rounded"
      onChange={onChange}
      id={id}
    />
    <div className="text-xs text-gray-500">Supported: {accept.replace(/\./g, ", ")}</div>
    {preview && (
      <div className="mt-2">
        <img src={preview} alt={`${label} Preview`} className="max-w-xs max-h-32 object-contain" />
      </div>
    )}
    {filename && <div className="mt-2 text-sm text-gray-700">{filename}</div>}
  </div>
);

const EditMoneyChangerModal = ({ onClose, data, onUpdate }) => {
  const [form, setForm] = useState({
    ...data,
    logo: null,
    kyc: null,
    logoBase64: "",
    logoFilename: "",
    kycBase64: "",
    kycFilename: "",
  });
  const [error, setError] = useState(null);
  const [selectedLocations, setSelectedLocations] = useState(data.locations || []);
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
    if (!form.companyName || !form.email) {
      setError("Company Name and Email are required.");
      return;
    }

    try {
      const schemeIdMap = {
        "Scheme - 01": 1,
        "Scheme - 02": 2,
        "Scheme - 03": 3,
        "Scheme - 04": 4,
        "Scheme - 05": 5,
        "Scheme - 06": 6,
        "Scheme - 07": 7,
        "Scheme - 08": 8,
        "Scheme - 09": 9,
        "Scheme - 10": 10,
      };
      const updateData = {
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
      const response = await api.put(`/api/v1/money-changers/${data.id}`, updateData);
      if (!response.data) {
        throw new Error(`No data received! Status: ${response.status}`);
      }
      if (onUpdate) onUpdate(response.data);
      setError(null);
      onClose(true);
    } catch (err) {
      setError(`Update failed: ${err.response?.status || err.message}`);
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
                <div className="flex-1 bg-gray-50 p-2 rounded h-48 overflow-y-auto">
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
                <div className="flex-1 bg-gray-100 p-2 rounded h-48 overflow-y-auto">
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
                value={form.scheme || ""}
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
              label="Logo"
              accept=".jpeg,.png,.gif,.pdf"
              id="logo-upload"
              onChange={(e) => handleFileChange(e, "logo")}
              preview={logoPreview}
              filename={form.logoFilename}
            />
            <FileUpload
              label="KYC"
              accept=".pdf"
              id="kyc-upload"
              onChange={(e) => handleFileChange(e, "kyc")}
              preview={null}
              filename={form.kycFilename}
            />
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
    companyName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    dateOfIncorporation: PropTypes.string,
    uen: PropTypes.string,
    address: PropTypes.string,
    country: PropTypes.string,
    postalCode: PropTypes.string,
    notes: PropTypes.string,
    scheme: PropTypes.string,
    role: PropTypes.string,
    locations: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

EditMoneyChangerModal.defaultProps = {
  onUpdate: null,
};

export default EditMoneyChangerModal;