import React, { useState } from "react";

const locationsList = ["Tampines", "Simei"];

export default function EditMoneyChangerModal({ onClose, data }) {
  const [form, setForm] = useState({
    ...data,
    logo: null,
    kyc: null,
  });
  const [error, setError] = useState("");
  const [selectedLocations, setSelectedLocations] = useState(["Simei"]); // example

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleFile = (e, key) => {
    setForm(f => ({ ...f, [key]: e.target.files[0] }));
  };

  const handleLocationSelect = loc => {
    if (!selectedLocations.includes(loc)) {
      setSelectedLocations([...selectedLocations, loc]);
    }
  };
  const handleLocationDeselect = loc => {
    setSelectedLocations(selectedLocations.filter(l => l !== loc));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // TODO: API call or validation logic
    if (!form.company || !form.email) {
      setError("Company Name and Email are required.");
      return;
    }
    // ...submit logic
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <form
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-8 relative"
        onSubmit={handleSubmit}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 text-2xl text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-6">Edit Money Changer</h2>
        <div className="grid grid-cols-2 gap-6">
          {/* Left Side */}
          <div className="space-y-4">
            <div>
              <label className="font-semibold">Email</label>
              <input
                className="input w-full bg-gray-100"
                name="email"
                value={form.email}
                readOnly
                disabled
              />
            </div>
            <div>
              <label className="font-semibold">Company Name</label>
              <input
                className="input w-full bg-gray-100"
                name="company"
                value={form.company}
                readOnly
                disabled
              />
            </div>
            <div>
              <label className="font-semibold">Role</label>
              <input
                className="input w-full bg-gray-100"
                value={form.role || "Money Changer Staff"}
                readOnly
                disabled
              />
            </div>
            <div>
              <label className="font-semibold">Date of Incorporation</label>
              <input
                className="input w-full bg-gray-100"
                type="text"
                value={form.date}
                readOnly
                disabled
              />
            </div>
            <div>
              <label className="font-semibold">UEN</label>
              <input
                className="input w-full"
                name="uen"
                value={form.uen}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="font-semibold">Address</label>
              <textarea
                className="input w-full"
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={2}
              />
            </div>
            <div className="flex gap-4">
              <div>
                <label className="font-semibold">Country</label>
                <select
                  className="input"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                >
                  <option>Singapore</option>
                  <option>Malaysia</option>
                  <option>India</option>
                </select>
              </div>
              <div>
                <label className="font-semibold">Postal Code</label>
                <input
                  className="input"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="font-semibold">Money Changer Notes</label>
              <textarea
                className="input w-full"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={2}
              />
            </div>
          </div>
          {/* Right Side */}
          <div className="space-y-4">
            <div>
              <label className="font-semibold">Location List</label>
              <div className="flex gap-2 mb-1">
                <div className="flex-1 bg-gray-50 border rounded p-2">
                  {locationsList.filter(l => !selectedLocations.includes(l)).map(loc => (
                    <div key={loc} className="flex justify-between items-center">
                      <span>{loc}</span>
                      <button
                        type="button"
                        className="text-blue-600 underline text-xs"
                        onClick={() => handleLocationSelect(loc)}
                      >
                        Select
                      </button>
                    </div>
                  ))}
                  {locationsList.length === selectedLocations.length && (
                    <div className="text-gray-400 text-xs">All selected</div>
                  )}
                </div>
                <div className="flex-1 bg-gray-100 border rounded p-2">
                  <div className="font-semibold text-xs mb-1">Selected Location</div>
                  {selectedLocations.map(loc => (
                    <div key={loc} className="flex justify-between items-center">
                      <span>{loc}</span>
                      <button
                        type="button"
                        className="text-red-500 underline text-xs"
                        onClick={() => handleLocationDeselect(loc)}
                      >
                        DeSelect
                      </button>
                    </div>
                  ))}
                  {selectedLocations.length === 0 && (
                    <div className="text-gray-400 text-xs">None selected</div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <label className="font-semibold">Schema</label>
              <select
                className="input w-full"
                name="schema"
                value={form.schema}
                onChange={handleChange}
              >
                <option>Scheme - 01</option>
                <option>Scheme - 02</option>
                <option>Scheme - 03</option>
              </select>
            </div>
            <div>
              <label className="font-semibold">Drop logo/other file here</label>
              <input
                type="file"
                accept=".jpg,.png,.gif,.pdf"
                className="block mt-1"
                onChange={e => handleFile(e, "logo")}
              />
              <div className="text-xs text-gray-400">
                Supported format: JPG/PNG/GIF/PDF
              </div>
            </div>
            <div>
              <label className="font-semibold">Drop KYC here</label>
              <input
                type="file"
                accept=".jpg,.png,.gif,.pdf"
                className="block mt-1"
                onChange={e => handleFile(e, "kyc")}
              />
              <div className="text-xs text-gray-400">
                Supported format: JPG/PNG/GIF/PDF
              </div>
            </div>
          </div>
        </div>
        {error && (
          <div className="bg-yellow-100 text-red-700 p-3 mt-6 rounded">
            <b>Error Message</b>
            <br />
            {error}
          </div>
        )}
        <div className="flex justify-end mt-8">
          <button
            type="submit"
            className="bg-indigo-500 text-white px-8 py-2 rounded shadow hover:bg-indigo-600 transition"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}