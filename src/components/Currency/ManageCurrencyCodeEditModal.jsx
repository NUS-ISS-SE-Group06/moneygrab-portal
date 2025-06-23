import React, { useState, useEffect } from "react";
import api from '../../api/axios';
import PropTypes from "prop-types";

const ManageCurrencyCodeEditModal = ({ selected, onClose, onUpdated }) => {
  const [userId] = useState(1);
  const [moneyChangerCurrency, setMoneyChangerCurrency]= useState(selected);
  const [error, setError] = useState(null);
  const [currencyList,setCurrencyList] = useState([]);

  useEffect(() => {
    const fetchCurrencies = async () => {
      setError("");
      try {
        const response = await api.get(`/api/v1/currencies`);
        setCurrencyList(response.data);
      } catch(err) {
          console.error("Failed to fetch currencyList:", err);
          setError("Failed to fetch currencyList.");
      }
    };
    fetchCurrencies();
  }, []);

  const handleSave = async () => {
    const errors = [];
    setError("");

    const { id, moneyChangerId, currencyId, currencyDescription }= moneyChangerCurrency ?? {};

    if (!moneyChangerId) {
      errors.push("Money Changer is required.");
    } 

    if (!currencyId) {
      errors.push("Currency is required.");
    } 

    if (errors.length > 0) {
      setError(errors.join("\n"));
      return;
    }

    try {
      const payload ={
        id,
        moneyChangerId,
        currencyId,
        createdBy: userId,
      }

      const response = await api.put(`/api/v1/money-changers-currencies/${id}`, payload);

      const created = response.data;

      const enrinched = {
        ...created,
        currencyDescription,
      };

      console.log("Response from server:", enrinched);

      onUpdated(enrinched);
      onClose();

    } catch (err) {
      console.error(err);

      const message =
        err?.response?.data ||
        err?.message ||
        "Failed to save the form. Please try again.";

      setError(message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-purple-100 p-10 w-full max-w-xl relative animate-fade-in">
        <button
          className="absolute top-5 right-6 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-3 text-gray-900">Edit Curency Code</h2>
        <div className="mb-8 border-b border-t pb-8 pt-3">
          <label htmlFor="company-name-label" className="block mb-2 font-semibold text-gray-800">Money Changer <span className="text-red-500">*</span></label>
          <p id="company-name-label" className="w-full border rounded-lg p-3 text-base bg-gray-100 mb-6">{moneyChangerCurrency?.companyName ?? '—'}</p>
            
          <label htmlFor="currency-code-select" className="block mb-2 font-semibold text-gray-800">Currency Code <span className="text-red-500">*</span></label>
          <select
            id="currency-code-select"
            className="w-full border rounded-lg p-3 text-base bg-gray-50 mb-6"
            value={moneyChangerCurrency?.currencyId ?? "" }
            onChange={(e) => {
              const selectedOption = e.target.options[e.target.selectedIndex];
              const selectedDescription= selectedOption?.getAttribute("data-description");
              const selectedId= parseInt(e.target.value);
              const selectedSymbol = selectedOption?.getAttribute("data-symbol");

              setMoneyChangerCurrency({
                ...moneyChangerCurrency,
                currencyId: selectedId,
                currency: selectedSymbol,
                currencyDescription: selectedDescription,
              });
            }}
          >
            <option value="">Select Symbol</option>
            {currencyList.map( (item) => (
              <option key={item.id} 
                      value={item.id}
                      data-symbol={item.currency}
                      data-description={item.description}
              >{item.currency}</option>
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
};

ManageCurrencyCodeEditModal.propTypes = {
  selected: PropTypes.object.isRequired, 
  onClose: PropTypes.func.isRequired,
  onUpdated: PropTypes.func.isRequired
}

export default ManageCurrencyCodeEditModal;
