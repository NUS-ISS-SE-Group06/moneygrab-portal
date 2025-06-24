import React, { useState, useEffect } from "react";
import api from '../../api/axios';
import PropTypes from "prop-types";

const CompanyCommissionSchemeEditModal = ({ selectedRecord, onClose, onUpdated}) => {
  const [userId] = useState(1);
  const [companyCommissionScheme, setCompanyCommissionScheme] = useState(selectedRecord);
  const [error, setError] = useState("");
  const [moneyChangerList,setMoneyChangerList] = useState([]);

useEffect(() => {
  const fetchmoneyChanger = async () => {
    setError("");

    try {
      const response = await api.get('/api/v1/money-changers');
      setMoneyChangerList(response.data);

    } catch(err) {
        console.error("Failed to fetch moneyChangerList:", err);
        setError("Failed to fetch moneyChangerList.");
    }
  };

  fetchmoneyChanger();
}, []);


  const handleSave = async () => {
    const errors = [];
    setError("");

    if (!companyCommissionScheme?.schemeId) {
      errors.push("Commission scheme is required.");
    }
    
    if (!companyCommissionScheme?.moneyChangerId) {
      errors.push("Money Changer is required.");
    } 

    if (errors.length > 0) {
      setError(errors.join("\n"));
      return;
    }

    try {
      const { id, moneyChangerId, schemeId } = companyCommissionScheme;
      const response = await api.put(`/api/v1/company-commission-schemes/${id}`, {
        id,
        moneyChangerId,
        schemeId,
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

  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-purple-100 p-10 w-full max-w-xl relative animate-fade-in">
        <button
          className="absolute top-5 right-6 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >×</button>
        <h2 className="text-2xl font-bold mb-3 text-gray-900">Set Commission Scheme</h2>
        <div className="mb-8 border-b border-t pb-8 pt-3">
              <label className="block mb-2 font-semibold text-gray-800">Commission Tag <span className="text-red-500">*</span></label>
              <p className="w-full border rounded-lg p-3 text-base bg-gray-100 mb-6">{companyCommissionScheme?.nameTag ?? '—'}</p>
              <label htmlFor="commission-scheme-select" className="block mb-2 font-semibold text-gray-800">Money Changer <span className="text-red-500">*</span></label>
              <select
                id="commission-scheme-select"
                className="w-full border rounded-lg p-3 text-base bg-gray-50 mb-6"
                value={companyCommissionScheme?.moneyChangerId ?? ""}
                onChange={(e) => {
                                  const selectedId=parseInt(e.target.value);
                                  const selectedName = e.target.options[e.target.selectedIndex].text;
                                  setCompanyCommissionScheme({...companyCommissionScheme,moneyChangerId: selectedId, companyName: selectedName});
                }}
              >
                <option value="">Select Money Changer</option>
                {moneyChangerList.map( (item) => (
                  <option key={item.id} value={item.id}>{item.companyName}</option>
                ))}
              </select>
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
}

CompanyCommissionSchemeEditModal.propTypes = {
  selectedRecord: PropTypes.object.isRequired, 
  onClose: PropTypes.func.isRequired,
  onUpdated: PropTypes.func.isRequired
};

export default CompanyCommissionSchemeEditModal;