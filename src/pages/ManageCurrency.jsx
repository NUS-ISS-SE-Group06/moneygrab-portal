import React, { useState } from "react";
import api from "../api/axios";
import ManageCurrencyCodeCreateModal from "../components/Currency/ManageCurrencyCodeCreateModal";
import ManageCurrencyCodeEditModal from "../components/Currency/ManageCurrencyCodeEditModal";
import {useQuery, useQueryClient, useMutation} from "@tanstack/react-query";
import {CACHE_DURATION} from "../constants/cache"


const fetchMoneyChangerCurrencies = async (moneyChangerId) => {
  const response = await api.get("/api/v1/money-changers-currencies", {
          params: { moneyChangerId }
  });
  return response.data;

};

const deleteMoneyChangerCurrency = async ({id, userId}) => {
  await api.delete(`/api/v1/money-changers-currencies/${id}`, {
    params: { userId }
  });
};


const ManageCurrency = () => {
  const [userId] = useState(1);
  const [moneyChanger]= useState({id: 1, companyName: "Company 1"});
  const [error, setError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: moneyChangerCurrencies =[],
    isLoading,
    queryError,
  } = useQuery ( {
    queryKey: ["moneyChangerCurrencies", moneyChanger?.id],
    queryFn: () => fetchMoneyChangerCurrencies(moneyChanger?.id),
    enabled: !!moneyChanger?.id,
    staleTime: CACHE_DURATION,
    refetchOnWindowFocus: true,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMoneyChangerCurrency,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["moneyChangerCurrencies", moneyChanger?.id]);
      setSelectedRecord(null);
    },
    onError: (err) => {
      const message = err?.response?.data || err?.message || "Failed to delete the form. Please try again.";
      setError(message);
    },
  });


  const handleOnCreated = async (newData) => {
    await queryClient.invalidateQueries(["moneyChangerCurrencies", moneyChanger?.id]);
    setIsCreateModalOpen(false);
  };

  const handleOnUpdated = async (updatedItem) => {
    await queryClient.invalidateQueries(["moneyChangerCurrencies", moneyChanger?.id]);
    setIsEditModalOpen(false);
  };

  const handleDelete = async (item) => {
    setError(null);
    deleteMutation.mutate({id: item.id, userId});
  };  


  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-10">
        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold">MANAGE CURRENCY CODES</h1>
          <button 
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded flex items-center font-medium"
            onClick={ () => { setError(null); setIsCreateModalOpen(true)}}
          >
            + Set New Currency Code
          </button>
        </div>

        {(error || queryError) && (
          <div className="mb-4">
            <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded">
              <p className="font-bold">Error Message</p>
              <p className="whitespace-pre-line">{error || queryError?.message } </p>
            </div>
          </div>
        )}

        <div className="mb-[3mm]">
          <span>Money Changer: </span>
          <span className="font-bold">{moneyChanger?.companyName}</span>
        </div>

        <div className="w-3/4 bg-white shadow rounded">
          {isLoading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : (
            <table className="min-w-full table-fixed text-left border border-gray-300 border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 divide-x divide-gray-300">
                  <th className="py-2 px-4">Symbol</th>
                  <th className="py-2 px-4 py-2 px-4 w-[60%]">Description</th>
                  <th className="py-2 px-4 text-center w-20"></th>
                </tr>
              </thead>
              <tbody>
                { moneyChangerCurrencies.map((item) => {
                  const isSelected = selectedRecord?.id === item.id;

                  return (                             
                        <tr key={item.id} 
                            className={`border-b last:border-b-0 cursor-pointer divide-x divide-gray-300  ${isSelected ? "bg-indigo-100" : ""}`}
                            onClick={() => { setSelectedRecord(item); console.log("Selected Scheme:", item);}}
                        >
                          <td className="py-2 px-4">{item.currency}</td>
                          <td className="py-2 px-4">{item.currencyDescription}</td>
                          <td className="py-2 px-4 flex justify-end gap-2">
                            <button 
                              className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
                              onClick={() => { setIsEditModalOpen(true) }}
                            >
                              Edit
                            </button>
                            <button 
                              className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
                              onClick={() => { handleDelete(item) }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {isCreateModalOpen && (
          <ManageCurrencyCodeCreateModal
            moneychanger={moneyChanger}
            onClose={() => setIsCreateModalOpen(false)}
            onCreated={handleOnCreated}
          />
        )}

        {isEditModalOpen && (
          <ManageCurrencyCodeEditModal
            selected={selectedRecord}
            onClose={() => setIsEditModalOpen(false)}
            onUpdated={handleOnUpdated}
          />
        )}
        <hr className="border-t border-grey my-6" />
      </main>
    </div>
  );
}

export default ManageCurrency;