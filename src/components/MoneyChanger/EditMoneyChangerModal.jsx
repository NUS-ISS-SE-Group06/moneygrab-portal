import React, { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import api from "../../api/axios";

const locationsList = ["Tampines", "Simei"];

const EditMoneyChangerModal = ({ id, onClose, onUpdate }) => {
  const [form, setForm] = useState({
    id: id,
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
  const isMounted = useRef(false); // To prevent double fetch on mount

  // Fetch detailed data when id changes
  useEffect(() => {
    let isActive = true; // To cancel fetch if component unmounts
    const fetchData = async () => {
      if (!id || !isMounted.current) return;
      try {
        console.log("Fetching data for id:", id); // Debug log
        const response = await api.get(`/api/v1/money-changers/${id}`);
        if (!isActive) return; // Prevent state update if unmounted
        const moneyChangerData = response.data;
        console.log("Fetched data:", moneyChangerData); // Debug log
        setForm((prev) => ({
          ...prev,
          companyName: moneyChangerData.companyName || prev.companyName,
          email: moneyChangerData.email || prev.email,
          dateOfIncorporation: moneyChangerData.dateOfIncorporation || prev.dateOfIncorporation,
          uen: moneyChangerData.uen || prev.uen,
          address: moneyChangerData.address || prev.address,
          country: moneyChangerData.country || prev.country,
          postalCode: moneyChangerData.postalCode || prev.postalCode,
          notes: moneyChangerData.notes || prev.notes,
          scheme: moneyChangerData.scheme || prev.scheme,
          role: moneyChangerData.role || prev.role,
          logoBase64: moneyChangerData.logoBase64 || prev.logoBase64,
          logoFilename: moneyChangerData.logoFilename || prev.logoFilename,
          kycBase64: moneyChangerData.kycBase64 || prev.kycBase64,
          kycFilename: moneyChangerData.kycFilename || prev.kycFilename,
        }));
        setSelectedLocations(moneyChangerData.locations || []);
        // Validate and set logo preview with proper data URL
        if (moneyChangerData.logoBase64) {
          const mimeType = moneyChangerData.logoFilename
            ?.split(".")
            .pop()
            .toLowerCase() === "pdf"
            ? "application/pdf"
            : `image/${moneyChangerData.logoFilename
                ?.split(".")
                .pop()
                .toLowerCase() || "jpeg"}`;
          setLogoPreview(`data:${mimeType};base64,${moneyChangerData.logoBase64}`);
        } else {
          setLogoPreview(null);
        }
        // Set KYC download URL
        if (moneyChangerData.kycBase64) {
          const byteCharacters = atob(moneyChangerData.kycBase64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "application/pdf" });
          setKycDownloadUrl(URL.createObjectURL(blob));
        }
      } catch (err) {
        if (isActive) {
          setError(`Failed to fetch data: ${err.response?.status || err.message}`);
          console.error("Fetch error:", err);
        }
      }
    };

    isMounted.current = true;
    fetchData();

    return () => {
      isActive = false; // Cleanup on unmount
      isMounted.current = false;
    };
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const newForm = { ...prev, [name]: value };
      console.log("Updated form:", newForm); // Debug log
      return newForm;
    });
  };

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setForm((prev) => {
          if (key === "logo") {
            return {
              ...prev,
              logo: file,
              logoBase64: base64String,
              logoFilename: file.name,
            };
          } else if (key === "kyc") {
            return {
              ...prev,
              kyc: file,
              kycBase64: base64String,
              kycFilename: file.name,
            };
          }
          return prev;
        });
        if (key === "logo") {
          setLogoPreview(base64String); // Use raw base64 for uploaded files
        } else if (key === "kyc") {
          setKycDownloadUrl(null); // Reset download URL on new upload
        }
      };
      reader.readAsDataURL(file);
    } else {
      setForm((prev) => {
        if (key === "logo") {
          return { ...prev, logo: null, logoBase64: "", logoFilename: "" };
        } else if (key === "kyc") {
          return { ...prev, kyc: null, kycBase64: "", kycFilename: "" };
        }
        return prev;
      });
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

      const response = await api.put(`/api/v1/money-changers/${form.id}`, updateData);
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
              {logoPreview && (
                <div className="mt-2">
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="max-w-xs max-h-32 object-contain"
                    onError={(e) => console.log("Image load error:", e)} // Debug broken image
                  />
                </div>
              )}
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