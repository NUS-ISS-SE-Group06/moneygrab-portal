import React, { useState } from "react";
import api from '../../api/axios';
import PropTypes from "prop-types";
import {useQuery} from "@tanstack/react-query"
import {CACHE_DURATION } from "../../constants/cache"

const CURRENCY_LIST="currencyList";

const fetchCurrencyList = async () => (await api.get(`/api/v1/currencies`)).data;

const CommissionRateCreateModal = ({ selectedScheme, onClose, onCreated}) => {
  const [userId] = useState(1);
  const [commissionRate, setCommissionRate] = useState({
    currencyId: null,
    currency: "",
    schemeId: selectedScheme?.id,
    nameTag: selectedScheme?.nameTag, 
    rate: null,
  });
  const [error, setError] = useState("");

  const { data: currencyList = [], error: queryError, } = useQuery ({ queryKey: [CURRENCY_LIST], queryFn: fetchCurrencyList, staleTime: CACHE_DURATION, refetchOnWindowFocus: true, });

  const handleSave = async () => {
    const errors = [];
    setError("");

    if (!commissionRate?.schemeId) {
      errors.push("Commission scheme is required.");
    } 

    if (!commissionRate?.currencyId) {
      errors.push("Symbol is required.");
    }

    if (!commissionRate?.rate || isNaN(commissionRate?.rate) || Number(commissionRate?.rate) <= 0) {
      errors.push("A valid commission rate greater than 0 is required.");
    }
    
    if (errors.length > 0) {
      setError(errors.join("\n"));
      return;
    }

    try {
      const response = await api.post(`/api/v1/commission-rates`, {
        currencyId: commissionRate?.currencyId,
        schemeId: commissionRate?.schemeId,
        rate: commissionRate?.rate,
        createdBy: userId,
      });

      const created = response.data;

      const enrinched = {
        ...created,
        currency: commissionRate?.currency,
        schemeId: commissionRate?.schemeId,
        nameTag: commissionRate?.nameTag,
      };

      console.log("Response from server:", enrinched);
      
      onCreated(enrinched);
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
        <h2 className="text-2xl font-bold mb-3 text-gray-900">Create Commission Rates</h2>
        <div className="mb-8 border-b border-t pb-8 pt-3">
              <label className="block mb-2 font-semibold text-gray-800">Commission Tag <span className="text-red-500">*</span></label>
              <p className="w-full border rounded-lg p-3 text-base bg-gray-100 mb-6">{commissionRate?.nameTag ?? '—'}</p>
              <label htmlFor="currency-select" className="block mb-2 font-semibold text-gray-800">Symbol <span className="text-red-500">*</span></label>
              <select
                id="currency-select"
                className="w-full border rounded-lg p-3 text-base bg-gray-50 mb-6"
                value={commissionRate?.currencyId ?? "" }
                onChange={(e) => {
                                  const selectedId=parseInt(e.target.value);
                                  const selectedName = e.target.options[e.target.selectedIndex].text;
                                  setCommissionRate({...commissionRate,currencyId: selectedId, currency: selectedName});
                }}
              >
                <option value="">Select Symbol</option>
                {currencyList.map( (item) => (
                  <option key={item.id} value={item.id}>{item.currency}</option>
                ))}
              </select>
              <label  htmlFor="commission-rate-input" className="block mb-2 font-semibold text-gray-800">Commission Rate <span className="text-red-500">*</span></label>
              <input
                id="commission-rate-input"
                type="number"
                step="0.01"
                placeholder="Enter commission rate (e.g. 0.5)"
                className="w-full border rounded-lg p-3 text-base bg-gray-50 mb-6"
                value={commissionRate?.rate ?? ""}
                onChange={(e) => setCommissionRate({ ...commissionRate, rate: e.target.value })}
              />
        </div>

        {(error || queryError) && (
          <div className="mb-4">
            <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded">
              <p className="font-bold">Error Message</p>
              <p className="whitespace-pre-line">{error || queryError?.message}</p>
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

CommissionRateCreateModal.propTypes = {
  selectedScheme: PropTypes.object.isRequired, 
  onClose: PropTypes.func.isRequired,
  onCreated: PropTypes.func.isRequired
}

export default CommissionRateCreateModal;