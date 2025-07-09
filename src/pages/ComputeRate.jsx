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

const validateField = (field, value) => {
  if (["spread","skew","marBid", "cfBid", "marAsk", "cfAsk"].includes(field) && isNaN(parseFloat(value))) {
    return "Invalid decimal value";
  }
  return "";
};

const initialRow = [
  {
    Currency: "",
    moneyChangerId: 1,
    Unit: "1",
    TradeType: "",
    Deno: "",
    Rounding: 1,
    rawBid: 0,
    rawAsk: 0,
    Spread: 0,
    Skew: 0,
    wsBid: 0,
    wsAsk: 0,
    refBid: 0,
    dpBid: 0,
    marBid: 0,
    cfBid: 0,
    rtBid: 0,
    refAsk: 0,
    dpAsk: 0,
    marAsk: 0,
    cfAsk: 0,
    rtAsk: 0,
    processedAt: {},
    processedBy: 0
  },
];


const MONEYCHANGER_COMPUTE_RATES="computeRates";
const fetchComputeRates = async (moneyChangerId) => (await api.get(`/api/v1/compute-rates`, {params: { moneyChangerId }})).data;

const ComputeRate = () => {
  //const [userId] = useState(1);
  const [moneyChanger]= useState({id: 1, companyName: "Company 1"});
  const [rates, setRates] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState(styleOptions[0]);
  const [editingCell, setEditingCell] = useState({ row: null, field: null });
  const [cellErrors, setCellErrors] = useState({});
  //const [errorComputeRate, setErrorComputeRate] = useState(null);
  const [errorComputeRate] = useState(null);
  const { data: computeRates =[], isLoading: isLoadingComputeRate, error: queryErrorComputeRate, } = useQuery ( { queryKey: [MONEYCHANGER_COMPUTE_RATES,moneyChanger?.id], queryFn: () => fetchComputeRates(moneyChanger?.id), enabled: !!moneyChanger?.id, staleTime: CACHE_DURATION, refetchOnWindowFocus: true, });

  useEffect(() => {
    if (computeRates && computeRates.length > 0) {
      setRates(computeRates);
    }
  }, [computeRates]);


  const handleCellChange = (rowIndex, field, value) => {
    const updatedRates = [...rates];
    updatedRates[rowIndex][field] = value;
    setRates(updatedRates);

    const error = validateField(field, value);
    const key = `${rowIndex}-${field}`;
    setCellErrors((prev) => ({ ...prev, [key]: error }));
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

        {(errorComputeRate || queryErrorComputeRate ) && (
          <div className="mb-4">
            <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded">
              <p className="font-bold">Error Message</p>
              <p className="whitespace-pre-line">{errorComputeRate || queryErrorComputeRate?.message}</p>
            </div>
          </div>
        )}

            
        <div className="min-h-screen bg-gray-50">
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
              onClick={() => console.log("Compute Rate clicked")}
            >
              + Submit
            </button>
          </div>
          )}

          <div className="bg-white shadow rounded overflow-auto">
            <table className="min-w-full table-auto text-sm text-left border border-gray-300">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  {Object.keys(initialRow[0])
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
                                    value={value}
                                    onChange={(e) => handleCellChange(rowIndex, field, e.target.value)}
                                    onBlur={() => setEditingCell({ row: null, field: null })}
                                    autoFocus
                                    className={editClass}
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
                                    value={value}
                                    onChange={(e) => handleCellChange(rowIndex, field, e.target.value)}
                                    onBlur={() => setEditingCell({ row: null, field: null })}
                                    autoFocus
                                    className={editClass}
                                  />
                                  {cellErrors[`${rowIndex}-${field}`] && (
                                    <div className="text-red-500 text-xs absolute top-full left-0 mt-1">
                                      {cellErrors[`${rowIndex}-${field}`]}
                                    </div>
                                  )}
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
      
      </main>
    </div>
  );
}


export default ComputeRate;