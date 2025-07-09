import React, {useState,useEffect } from "react";
import api from "../api/axios";
import { useQuery } from "@tanstack/react-query";
import { CACHE_DURATION } from "../constants/cache";
import { format } from "date-fns";

const styleOptions = [
  "Normal Monitor Style",
  "Extended Monitor Style",
  "Normal Monitor - Multi Currency Style",
];
const tradeTypeOptions = ["BUY_SELL", "BUY_ONLY", "SELL_ONLY"];
const tradeDenoOptions = ["ALL", "50", "100", "1000", "10000", "100000"];
const unitOptions = ["1", "10", "100", "1000", "10000", "100000"];
const tradeRoundOptions = [0, 1, 2, 3, 4, 5];
const refOptions = [0, 1];
const dpOptions = [0, 1, 2, 3, 4, 5];

const fieldTooltips = {
  refBid: "0 = Direct, 1 = Inverse",
  refAsk: "0 = Direct, 1 = Inverse",
  dpBid: "Decimal Precision (0 to 5)",
  dpAsk: "Decimal Precision (0 to 5)",
  marBid: "Enter market bid as decimal",
  marAsk: "Enter market ask as decimal",
  cfBid: "Enter custom fee bid as decimal",
  cfAsk: "Enter custom fee ask as decimal",
};

const headerRow = [
  {
    Currency: "",
    moneyChangerId: 1,
    Unit: "1",
    TradeType: "",
    Deno: "",
    Rounding: 1,
    RawBid: 0,
    RawAsk: 0,
    Spread: 0,
    Skew: 0,
    WsBid: 0,
    WsAsk: 0,
    RefBid: 0,
    DpBid: 0,
    MarBid: 0,
    CfBid: 0,
    RtBid: 0,
    RefAsk: 0,
    DpAsk: 0,
    MarAsk: 0,
    CfAsk: 0,
    RtAsk: 0,
    ProcessedAt: {},
    ProcessedBy: 0
  },
];


const MONEYCHANGER_COMPUTE_RATES="computeRates";
const fetchComputeRates = async (moneyChangerId) => (await api.get(`/api/v1/compute-rates`, {params: { moneyChangerId }})).data;

const ComputeRate = () => {
  const [userId] = useState(1);
  const [moneyChanger]= useState({id: 1, companyName: "Company 1"});
  const [rates, setRates] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState(styleOptions[0]);
  const [editingCell, setEditingCell] = useState({ row: null, field: null });
  const [errorSubmit, setErrorSubmit] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: computeRates =[], isLoading: isLoadingComputeRate, error: queryErrorComputeRate, } = useQuery ( { queryKey: [MONEYCHANGER_COMPUTE_RATES,moneyChanger?.id], queryFn: () => fetchComputeRates(moneyChanger?.id), enabled: !!moneyChanger?.id, staleTime: CACHE_DURATION, refetchOnWindowFocus: true, });


  const fetchRawFxRates = async () => {
    return Promise.resolve([
    
      { currencyCode: "USD", rawBid: 1.3450, rawAsk: 1.3550 },
      { currencyCode: "EUR", rawBid: 1.4780, rawAsk: 1.4875 },
      { currencyCode: "JPY", rawBid: 0.0093, rawAsk: 0.0095 },
    
  
    ]);
  };

  const postToComputeLambda = async (payload) => {
    return Promise.resolve(payload);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setErrorSubmit("");
      const errors = [];

      // Step 1: Merge raw FX rates into local rates
      const fxRates = await fetchRawFxRates();
      const enhancedRates = rates.map(rate => {
        const fx = fxRates.find(fx => fx.currencyCode === rate.currencyCode);
        return {
          ...rate,
          rawBid: fx?.rawBid ?? rate.rawBid,
          rawAsk: fx?.rawAsk ?? rate.rawAsk,
          processedBy: userId
        };
      });
      
      // Step 2: Validate all records
      enhancedRates.forEach((rate, index) => {
        const hasError =
          !rate.currencyCode || rate.currencyCode.trim() === "" ||
          rate.moneyChangerId === null || rate.moneyChangerId === undefined ||
          !rate.unit || rate.unit.trim() === "" ||
          !rate.tradeType || rate.tradeType.trim() === "" ||
          !rate.tradeDeno || rate.tradeDeno.trim() === "" ||
          rate.tradeRound === null || rate.tradeRound === undefined ||
          rate.rawBid === null || rate.rawBid === undefined || isNaN(rate.rawBid) || rate.rawBid <= 0 ||
          rate.rawAsk === null || rate.rawAsk === undefined || isNaN(rate.rawAsk) || rate.rawAsk <= 0 ||
          rate.spread === null || rate.spread === undefined || isNaN(rate.spread) ||
          rate.skew === null || rate.skew === undefined || isNaN(rate.skew) ||
          rate.refBid === null || rate.refBid === undefined || isNaN(rate.refBid) || ( rate.refBid !== 0 && rate.refBid !== 1) ||
          rate.dpBid === null || rate.dpBid === undefined || isNaN(rate.dpBid) || rate.dpBid < 0 || rate.dpBid > 5 ||
          rate.marBid === null || rate.marBid === undefined || isNaN(rate.marBid) ||
          rate.cfBid === null || rate.cfBid === undefined || isNaN(rate.cfBid) ||
          rate.refAsk === null || rate.refAsk === undefined || isNaN(rate.refAsk) || ( rate.refAsk !== 0 && rate.refAsk !== 1) ||
          rate.dpAsk === null || rate.dpAsk === undefined || isNaN(rate.dpAsk) || rate.dpAsk < 0 || rate.dpAsk > 5 ||
          rate.marAsk === null || rate.marAsk === undefined || isNaN(rate.marAsk) ||
          rate.cfAsk === null || rate.cfAsk === undefined || isNaN(rate.cfAsk);
          
        if (hasError) {
          errors.push(` --> Row ${index+1} (${rate.currencyCode}) has error`);
        }

      });
            
      if (errors.length > 0) {
        setErrorSubmit("Please fill in all requird field correctly: \n" + errors.join("\n"));
        return;
      } 

     
      // Step 3: Post to Compute Lambda
      setErrorSubmit("");
      const computedRates = await postToComputeLambda(enhancedRates);

      // Step 4: Save final data
      const response = await api.post(`/api/v1/compute-rates/batch`, computedRates);
      setRates(response.data);

      setSubmitSuccess("Rates computed and saved successfully.");

    } catch (err) {
      const message = err?.response?.data || err?.message || "Submit failed.";
      setErrorSubmit(message);
    } finally {
      setIsSubmitting(false);
    }
  };


  useEffect(() => {
    if (computeRates && computeRates.length > 0) { setRates(computeRates); }
  }, [computeRates]);

  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => { setSubmitSuccess(""); }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitSuccess]);


  const handleCellChange = (rowIndex, field, value) => {
    const updatedRates = [...rates];
    updatedRates[rowIndex][field] = value;
    setRates(updatedRates);
  };

  const isEditableField = (field) => ["unit", "tradeType", "tradeDeno", "tradeRound", "spread", "skew","refBid", "dpBid", "marBid", "cfBid", "refAsk", "dpAsk", "marAsk", "cfAsk"].includes(field);
  const isDecimalInput = (field) => ["marBid", "cfBid", "marAsk", "cfAsk"].includes(field);

  const getDropdownOptions = (field) => {
    switch (field) {
      case "unit": return unitOptions;
      case "tradeType": return tradeTypeOptions;
      case "tradeDeno": return tradeDenoOptions;
      case "tradeRound": return tradeRoundOptions;
      case "refBid":
      case "refAsk": return refOptions;
      case "dpBid":
      case "dpAsk": return dpOptions;
      default: return null;
    }
  };


  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-10">
        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold">COMPUTE RATE</h1>
        </div>

        {(errorSubmit || queryErrorComputeRate ) && (
          <div className="mb-4">
            <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded">
              <p className="font-bold">Error Message</p>
              <p className="whitespace-pre-line">{errorSubmit || queryErrorComputeRate?.message}</p>
            </div>
          </div>
        )}

        {submitSuccess  && (
          <div className="mb-4">
            <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded">
              <div className="text-green-600 font-medium mt-2">{submitSuccess}</div>
            </div>
          </div>
        )}
            
        <div className="bg-gray-50">
           {isLoadingComputeRate ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : (
          <div className="flex items-center gap-4 mb-6">
            <div className="w-[300px]">
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {styleOptions.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-4 py-2 rounded"
              onClick={() => console.log("Preview clicked")}
            >
              Preview
            </button>

            <button
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-4 py-2 rounded flex items-center gap-1"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "+ Submit"}
            </button>
          </div>
          )}

          <div className="max-w-[1900px] bg-white shadow rounded overflow-auto">
            <table className="w-full table-auto text-sm text-left border border-gray-300">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  {Object.keys(headerRow[0])
                    .filter((header) => header !== "moneyChangerId")
                    .map((header) => (
                    <th key={header} className="px-4 py-2 whitespace-nowrap">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rates.map((item, rowIndex) => (
                  <tr key={`${item.currencyCode}-${item.moneyChangerId}`} className="even:bg-gray-50">
                    {Object.entries(item)
                      .filter(([field]) => field !== "moneyChangerId")
                      .map(([field, value]) => (
                      <td
                        key={field}
                        className={`px-4 py-2 cursor-pointer relative ${ isEditableField(field) ? "bg-yellow-100 hover:bg-yellow-200" : ""}`}
                        onClick={() => isEditableField(field) && setEditingCell({ row: rowIndex, field })}
                      >
                        {(() => {
                          const isEditing = editingCell.row === rowIndex && editingCell.field === field;
                          const editClass = "border px-2 py-1 rounded w-full bg-blue-100 focus:bg-blue-200";

                          if (isEditing) {
                            if (getDropdownOptions(field)) {
                              return (
                                <div>
                                  <select
                                    value={value?.toString() || ""}
                                    onChange={(e) => handleCellChange(rowIndex, field, e.target.value)}
                                    onBlur={() => setEditingCell({ row: null, field: null })}
                                    autoFocus
                                    className={`${editClass} min-w-[100px]`}
                                  >
                                    {getDropdownOptions(field).map((opt) => (
                                      <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                  </select>
                                </div>  
                              );
                            } else {
                              return (
                                <div>
                                  <input
                                    type="number"
                                    step={isDecimalInput(field) ? "0.01" : "1"}
                                    value={value ?? ""}
                                    onChange={(e) => handleCellChange(rowIndex, field, e.target.value)}
                                    onBlur={() => setEditingCell({ row: null, field: null })}
                                    autoFocus
                                    className={`${editClass} min-w-[100px]`}
                                  />
                                </div>
                              );
                            }

                          } else {
                            return (
                              <span title={fieldTooltips[field] || ""}>
                                {field === "processedAt" && value 
                                  ? format(new Date(value), "dd/MM/yyyy HH:mm:ss")
                                  : value}
                              </span>
                            );
                          }

                        })()}
 
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

                
        <hr className="border-t border-grey my-6" /> 


        <div className="mt-10">
          <h2 className="text-lg font-bold mb-2">Field Descriptions</h2>
          <table className="table-auto text-sm text-left border border-gray-300 bg-white shadow rounded">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">Code</th>
                <th className="px-4 py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                { code: (<span>Currency<span className="text-red-500 font-bold ml-1">*</span></span>), description: "The currency code, e.g., USD, EUR, SGD" },
                { code: (<span>Unit<span className="text-red-500 font-bold ml-1">*</span></span>), description: "Base unit used for the exchange rate (e.g., 1, 100, 1000)" },
                { code: (<span>TradeType<span className="text-red-500 font-bold ml-1">*</span></span>), description: "BUY_SELL / BUY_ONLY / SELL_ONLY" },
                { code: (<span>Deno<span className="text-red-500 font-bold ml-1">*</span></span>), description: "Trade Denomination (ALL, 50, 100, 1000, 10000, 100000)" },
                { code: (<span>Rounding<span className="text-red-500 font-bold ml-1">*</span></span>), description: "Trade rounding rule (0–5)" },
                { code: (<span>RawBid / RawAsk<span className="text-red-500 font-bold ml-1">*</span></span>), description: "Raw uploaded FX bid/ask rate. (cannot be zero)" },
                { code: (<span>Spread<span className="text-red-500 font-bold ml-1">*</span></span>), description: "Margin between bid and ask" },
                { code: (<span>Skew<span className="text-red-500 font-bold ml-1">*</span></span>), description: "Adjustable rate skew" },
                { code: "WsBid / WsAsk", description: "Wholesale bid/ask rate after computation" },
                { code: (<span>RefBid / RefAsk<span className="text-red-500 font-bold ml-1">*</span></span>), description: "0 = Direct, 1 = Inverse" },
                { code: (<span>DpBid / DpAsk<span className="text-red-500 font-bold ml-1">*</span></span>), description: "Decimal Precision (0–5)" },
                { code: (<span>MarBid / MarAsk<span className="text-red-500 font-bold ml-1">*</span></span>), description: "Market bid/ask adjustment" },
                { code: (<span>CfBid / CfAsk<span className="text-red-500 font-bold ml-1">*</span></span>), description: "Custom fee bid/ask adjustment" },
                { code: (<span>RtBid / RtAsk<span className="text-red-500 font-bold ml-1">*</span></span>), description: "Final bid/ask rate after adjustments" },
      
              ].map(({ code, description }) => (
                <tr key={code} className="even:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{code}</td>
                  <td className="px-4 py-2">{description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <hr className="border-t border-grey my-6" /> 
           
      </main>
    </div>
  );
}


export default ComputeRate;