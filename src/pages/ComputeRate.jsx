import React, {useState } from "react";
import api from "../api/axios";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { CACHE_DURATION } from "../constants/cache";

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

const initialRates = [
  {
    currency: "USD",
    unit: 1,
    tradeType: "BUY_SELL",
    tradeDeno: "ALL",
    tradeRound: 0,
    rawBid: 90,
    rawAsk: 23,
    spread: 11,
    skew: 11,
    wsBid: 11,
    wsAsk: 11,
    refBid: 11,
    dpBid: 11,
    marBid: 11,
    cfBid: 11,
    rtBid: 11,
    refAsk: 11,
    dpAsk: 11,
    marAsk: 11,
    cfAsk: 11,
    rtAsk: 11,
  },
  {
    currency: "CAD",
    unit: 1,
    tradeType: "BUY_SELL",
    tradeDeno: "ALL",
    tradeRound: 0,
    rawBid: 83,
    rawAsk: 43,
    spread: 85,
    skew: 85,
    wsBid: 85,
    wsAsk: 85,
    refBid: 85,
    dpBid: 85,
    marBid: 85,
    cfBid: 85,
    rtBid: 85,
    refAsk: 85,
    dpAsk: 85,
    marAsk: 85,
    cfAsk: 85,
    rtAsk: 85,
  },
  {
    currency: "EUR",
    unit: 1,
    tradeType: "BUY_SELL",
    tradeDeno: "ALL",
    tradeRound: 0,
    rawBid: 65,
    rawAsk: 10,
    spread: 85,
    skew: 85,
    wsBid: 85,
    wsAsk: 85,
    refBid: 85,
    dpBid: 85,
    marBid: 85,
    cfBid: 85,
    rtBid: 85,
    refAsk: 85,
    dpAsk: 85,
    marAsk: 85,
    cfAsk: 85,
    rtAsk: 85,
  },
  {
    currency: "GBP",
    unit: 1,
    tradeType: "BUY_SELL",
    tradeDeno: "ALL",
    tradeRound: 0,
    rawBid: 49,
    rawAsk: 47,
    spread: 80,
    skew: 80,
    wsBid: 80,
    wsAsk: 80,
    refBid: 80,
    dpBid: 80,
    marBid: 80,
    cfBid: 80,
    rtBid: 80,
    refAsk: 80,
    dpAsk: 80,
    marAsk: 80,
    cfAsk: 80,
    rtAsk: 80,
  },
];


const COMMISSION_SCHEME="commissionSchemes";

const fetchSchemes = async () => (await api.get(`/api/v1/schemes`)).data;

const deleteScheme = async ({ id, userId }) => await api.delete(`/api/v1/schemes/${id}`, { params: { userId } });

const ComputeRate = () => {
  const [userId] = useState(1);
  const [selectedStyle, setSelectedStyle] = useState(styleOptions[0]);
  const [rates, setRates] = useState(initialRates);
  const [editingCell, setEditingCell] = useState({ row: null, field: null });
  const [cellErrors, setCellErrors] = useState({});

  const handleCellChange = (rowIndex, field, value) => {
    const updatedRates = [...rates];
    updatedRates[rowIndex][field] = value;
    setRates(updatedRates);

    const error = validateField(field, value);
    const key = `${rowIndex}-${field}`;
    setCellErrors((prev) => ({ ...prev, [key]: error }));
  };

  const isEditableField = (field) => [
    "unit", "tradeType", "tradeDeno", "tradeRound", "spread", "skew",
    "refBid", "dpBid", "marBid", "cfBid", "refAsk", "dpAsk", "marAsk", "cfAsk"
  ].includes(field);

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

  const isDecimalInput = (field) => ["marBid", "cfBid", "marAsk", "cfAsk"].includes(field);
  
  const [selectedRecordScheme, setSelectedRecordScheme] = useState(null);

  const [errorScheme, setErrorScheme] = useState(null);

  const [isCreateModalOpenScheme, setIsCreateModalOpenScheme] = useState(false);
  const [isEditModalOpenScheme, setIsEditModalOpenScheme] = useState(false);

  const queryClient = useQueryClient();

  const { data: commissionSchemes =[], isLoading: isLoadingScheme, error: queryErrorScheme, } = useQuery ( { queryKey: ["commissionSchemes"], queryFn: () => fetchSchemes(), staleTime: CACHE_DURATION, refetchOnWindowFocus: true, });


  //Scheme
  const deleteMutationScheme = useMutation({
    mutationFn: deleteScheme,
    onSuccess: async () => {
      await queryClient.invalidateQueries([COMMISSION_SCHEME]);
      setSelectedRecordScheme(null);
    },
    onError: (err) => {
      const message = err?.response?.data || err?.message || "Failed to delete the form. Please try again.";
      setErrorScheme(message);
    },
  });

  const handleOnCreatedScheme = async (newData) => {
    await queryClient.invalidateQueries([COMMISSION_SCHEME]);
    setIsCreateModalOpenScheme(false);
  };

  const handleOnUpdatedScheme = async (updatedItem) => {
    await queryClient.invalidateQueries([COMMISSION_SCHEME]);
    setIsEditModalOpenScheme(false);
  };

  const handleDeleteScheme = async (item) => {
    setErrorScheme(null);
    deleteMutationScheme.mutate({id: item.id, userId});
  };  


  

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-10">
        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold">COMPUTE RATE</h1>
        </div>

        {(errorScheme || queryErrorScheme ) && (
          <div className="mb-4">
            <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded">
              <p className="font-bold">Error Message</p>
              <p className="whitespace-pre-line">{errorScheme || queryErrorScheme?.message}</p>
            </div>
          </div>
        )}

            
        <div className="min-h-screen bg-gray-50">
           {isLoadingScheme ? (
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
                  {Object.keys(rates[0]).map((header) => (
                    <th key={header} className="px-4 py-2 whitespace-nowrap">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rates.map((item, rowIndex) => (
                  <tr key={rowIndex} className="even:bg-gray-50">
                    {Object.entries(item).map(([field, value]) => (
                      <td
                        key={field}
                        className="px-4 py-2 cursor-pointer relative"
                        onClick={() => isEditableField(field) && setEditingCell({ row: rowIndex, field })}
                      >
                        {editingCell.row === rowIndex && editingCell.field === field ? (
                          getDropdownOptions(field) ? (
                            <div>
                              <select
                                value={value}
                                onChange={(e) => handleCellChange(rowIndex, field, e.target.value)}
                                onBlur={() => setEditingCell({ row: null, field: null })}
                                autoFocus
                                className="border px-2 py-1 rounded w-full"
                              >
                                {getDropdownOptions(field).map((opt) => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            </div>                        
                          ) : (
                            <div>
                              <input
                                type="number"
                                step={isDecimalInput(field) ? "0.01" : "1"}
                                value={value}
                                onChange={(e) => handleCellChange(rowIndex, field, e.target.value)}
                                onBlur={() => setEditingCell({ row: null, field: null })}
                                autoFocus
                                className="border px-2 py-1 rounded w-full"
                              />
                            {cellErrors[`${rowIndex}-${field}`] && (
                              <div className="text-red-500 text-xs absolute top-full left-0 mt-1">
                                {cellErrors[`${rowIndex}-${field}`]}
                              </div>
                            )}
                            </div>
                          )
                        ) : (
                          <span title={fieldTooltips[field] || ""}>{value}</span>
                        )}
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