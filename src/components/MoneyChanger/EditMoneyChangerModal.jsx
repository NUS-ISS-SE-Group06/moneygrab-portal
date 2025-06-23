import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import api from "../../api/axios";

/**
 * List of available locations for the money changer.
 * @type {string[]}
 */
const locationsList = ["Tampines", "Simei"];

/**
 * Modal component for editing money changer details.
 * @param {Object} props
 * @param {number} props.id - The ID of the money changer to edit.
 * @param {function} props.onClose - Callback to close the modal.
 * @param {function} [props.onUpdate] - Callback to handle update success.
 * @returns {JSX.Element} The edit money changer modal.
 */
const EditMoneyChangerModal = ({ id, onClose, onUpdate }) => {
  const [form, setForm] = useState({
    id,
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
  const [logoPreview, setLogoPreview] = useState(null);
  const [kycDownloadUrl, setKycDownloadUrl] = useState(null);

  /**
   * Fetches money changer data when the ID changes.
   */
  useEffect(() => {
    let isActive = true;
    const fetchData = async () => {
      if (!id) return;
      try {
        const response = await api.get(`/api/v1/money-changers/${id}`);
        if (!isActive) return;
        const data = response.data;
        updateFormAndState(data);
      } catch (err) {
        if (isActive) {
          setError(`Failed to fetch data: ${err.response?.status || err.message}`);
        }
      }
    };

    fetchData();
    return () => {
      isActive = false;
    };
  }, [id]);

  /**
   * Updates form and state with fetched data.
   * @param {Object} data - The money changer data from the API.
   */
  const updateFormAndState = (data) => {
    setForm((prev) => ({
      ...prev,
      companyName: data.companyName || prev.companyName,
      email: data.email || prev.email,
      dateOfIncorporation: data.dateOfIncorporation || prev.dateOfIncorporation,
      uen: data.uen || prev.uen,
      address: data.address || prev.address,
      country: data.country || prev.country,
      postalCode: data.postalCode || prev.postalCode,
      notes: data.notes || prev.notes,
      scheme: data.scheme || prev.scheme,
      role: data.role || prev.role,
      logoBase64: data.logoBase64 || prev.logoBase64,
      logoFilename: data.logoFilename || prev.logoFilename,
      kycBase64: data.kycBase64 || prev.kycBase64,
      kycFilename: data.kycFilename || prev.kycFilename,
    }));
    setSelectedLocations(data.locations || []);
    if (data.logoBase64) {
      const mimeType = data.logoFilename
        ?.split(".")
        .pop()
        .toLowerCase() === "pdf"
        ? "application/pdf"
        : `image/${data.logoFilename?.split(".").pop().toLowerCase() || "jpeg"}`;
      setLogoPreview(`data:${mimeType};base64,${data.logoBase64}`);
    } else {
      setLogoPreview(null);
    }
    if (data.kycBase64) {
      const byteArray = new Uint8Array(
        [...atob(data.kycBase64)].map((char) => char.charCodeAt(0))
      );
      const blob = new Blob([byteArray], { type: "application/pdf" });
      setKycDownloadUrl(URL.createObjectURL(blob));
    }
  };

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
        if (key === "logo") setLogoPreview(base64String);
        else if (key === "kyc") setKycDownloadUrl(null);
      };
      reader.readAsDataURL(file);
    } else {
      setForm((prev) => ({
        ...prev,
        ...(key === "logo"
          ? { logo: null, logoBase64: "", logoFilename: "" }
          : { kyc: null, kycBase64: "", kycFilename: "" }),
      }));
      if (key === "logo") setLogoPreview(null);
      else if (key === "kyc") setKycDownloadUrl(null);
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
   * Handles form submission to update the money changer.
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

      const response = await api.put(`/api/v1/money-changers/${form.id}`, updateData);
      if (!response.data) {
        throw new Error(`No data received! Status: ${response.status}`);
      }
      if (onUpdate) onUpdate(response.data);
      setError(null);
      onClose(true);
    } catch (err) {
      setError(`Update failed: ${err.message}`);
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
              <label htmlFor="email" className="block font-semibold text-gray-700">Email</label>
              <input
                id="email"
                className="w-full p-2 border rounded bg-gray-100"
                name="email"
                value={form.email || ""}
                readOnly
                disabled
              />
            </div>
            <div>
              <label htmlFor="companyName" className="block font-semibold text-gray-700">Company Name</label>
              <input
                id="companyName"
                className="w-full p-2 border rounded bg-gray-100"
                name="companyName"
                value={form.companyName || ""}
                readOnly
                disabled
              />
            </div>
            <div>
              <label htmlFor="role" className="block font-semibold text-gray-700">Role</label>
              <input
                id="role"
                className="w-full p-2 border rounded bg-gray-100"
                value={form.role || "Money Changer Staff"}
                readOnly
                disabled
              />
            </div>
            <div>
              <label htmlFor="dateOfIncorporation" className="block font-semibold text-gray-700">Date of Incorporation</label>
              <input
                id="dateOfIncorporation"
                className="w-full p-2 border rounded bg-gray-100"
                type="text"
                value={form.dateOfIncorporation || ""}
                readOnly
                disabled
              />
            </div>
            <div>
              <label htmlFor="uen" className="block font-semibold text-gray-700">UEN</label>
              <input
                id="uen"
                className="w-full p-2 border rounded"
                name="uen"
                value={form.uen || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="address" className="block font-semibold text-gray-700">Address</label>
              <textarea
                id="address"
                className="w-full p-2 border rounded"
                name="address"
                value={form.address || ""}
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
                  value={form.country || ""}
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
                  value={form.postalCode || ""}
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
                value={form.notes || ""}
                onChange={handleChange}
                rows={2}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="locations" className="block font-semibold text-gray-700">Locations</label>
              <div id="locations" className="flex gap-2">
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
              <label htmlFor="scheme" className="block font-semibold text-gray-700">Scheme</label>
              <select
                id="scheme"
                className="w-full p-2 border rounded"
                name="scheme"
                value={form.scheme || ""}
                onChange={handleChange}
              >
                <option value="Scheme - 01">Scheme - 01</option>
                <option value="Scheme - 02">Scheme - 02</option>
                <option value="Scheme - 03">Scheme - 03</option>
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
              {logoPreview && (
                <div className="mt-2">
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="max-w-xs max-h-32 object-contain"
                  />
                </div>
              )}
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
              {form.kycFilename && (
                <div className="mt-2 text-sm text-gray-700">{form.kycFilename}</div>
              )}
              {kycDownloadUrl && (
                <div className="mt-2">
                  <a
                    href={kycDownloadUrl}
                    download={form.kycFilename || "kyc_document.pdf"}
                    className="text-indigo-500 underline text-sm"
                  >
                    Download KYC PDF
                  </a>
                </div>
              )}
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
  id: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func,
};

EditMoneyChangerModal.defaultProps = {
  onUpdate: null,
};

export default EditMoneyChangerModal;