import React, { useState } from "react";

const initialState = {
  companyName: "",
  email: "",
  date: "",
  address: "",
  country: "Singapore",
  postalCode: "",
  uen: "",
  schema: "Scheme - 01",
  notes: "",
  logo: null,
  kyc: null,
  locations: [],
};

const locationsList = ["Tampines", "Simei"];

export default function CreateMoneyChangerModal({ onClose, onSave }) {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [selectedLocations, setSelectedLocations] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleFile = (e, key) => {
    setForm((f) => ({ ...f, [key]: e.target.files[0] }));
  };

  const handleLocationSelect = (loc) => {
    if (!selectedLocations.includes(loc)) {
      setSelectedLocations([...selectedLocations, loc]);
    }
  };

  const handleLocationDeselect = (loc) => {
    setSelectedLocations(selectedLocations.filter((l) => l !== loc));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.companyName || !form.email) {
      setError("Company Name and Email are required.");
      return;
    }
    onSave({ ...form, locations: selectedLocations });
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <form
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 relative"
        onSubmit={handleSubmit}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-2xl text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-700">Create Money Changer</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Company Name</label>
              <input
                className="input w-full mt-1"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                placeholder="Company name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <input
                className="input w-full mt-1"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email address"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Date of Incorporation</label>
              <input
                className="input w-full mt-1"
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Address</label>
              <textarea
                className="input w-full mt-1"
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={2}
                placeholder="Address"
              />
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-600">Country</label>
                <select
                  className="input w-full mt-1"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                >
                  <option>Singapore</option>
                  <option>Malaysia</option>
                  <option>India</option>
                </select>
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-600">Postal Code</label>
                <input
                  className="input w-full mt-1"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Money Changer Notes</label>
              <textarea
                className="input w-full mt-1"
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
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-600">Location List</label>
                <div className="bg-gray-50 p-2 rounded mt-1 h-24 overflow-y-auto">
                  {locationsList
                    .filter((l) => !selectedLocations.includes(l))
                    .map((loc) => (
                      <div key={loc} className="flex justify-between items-center py-1">
                        <span className="text-sm text-gray-700">{loc}</span>
                        <button
                          type="button"
                          className="text-indigo-600 text-sm underline"
                          onClick={() => handleLocationSelect(loc)}
                        >
                          Select
                        </button>
                      </div>
                    ))}
                </div>
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-600">Selected Location</label>
                <div className="bg-gray-50 p-2 rounded mt-1 h-24 overflow-y-auto">
                  {selectedLocations.map((loc) => (
                    <div key={loc} className="flex justify-between items-center py-1">
                      <span className="text-sm text-gray-700">{loc}</span>
                      <button
                        type="button"
                        className="text-red-600 text-sm underline"
                        onClick={() => handleLocationDeselect(loc)}
                      >
                        DeSelect
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
              <label className="block text-sm font-medium text-gray-600">UEN</label>
              <input
                className="input w-full mt-1"
                name="uen"
                value={form.uen}
                onChange={handleChange}
                placeholder="UEN"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Schema</label>
              <select
                className="input w-full mt-1"
                name="schema"
                value={form.schema}
                onChange={handleChange}
              >
                <option>Scheme - 01</option>
                <option>Scheme - 02</option>
                <option>Scheme - 03</option>
              </select>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <div className="text-gray-400 mb-2">Drop logo/other files here</div>
              <div className="text-gray-500 text-sm">Supported format: JPG/PNG/GIF/PDF</div>
              <input
                type="file"
                accept=".jpg,.png,.gif,.pdf"
                className="hidden"
                onChange={(e) => handleFile(e, "logo")}
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="mt-2 inline-block bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 cursor-pointer"
              >
                Browse files
              </label>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <div className="text-gray-400 mb-2">Drop KYC here</div>
              <div className="text-gray-500 text-sm">Supported format: JPG/PNG/GIF/PDF</div>
              <input
                type="file"
                accept=".jpg,.png,.gif,.pdf"
                className="hidden"
                onChange={(e) => handleFile(e, "kyc")}
                id="kyc-upload"
              />
              <label
                htmlFor="kyc-upload"
                className="mt-2 inline-block bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 cursor-pointer"
              >
                Browse files
              </label>
            </div>
          </div>
        </div>
        {error && (
          <div className="bg-yellow-100 text-red-700 p-3 mt-4 rounded">
            <b>Error Message</b>
            <br />
            {error}
          </div>
        )}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-indigo-500 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-600 transition"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}