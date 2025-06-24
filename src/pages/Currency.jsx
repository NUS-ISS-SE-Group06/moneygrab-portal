import React, {useState } from "react";
import api from "../api/axios";
import {useQuery} from "@tanstack/react-query";
import {CACHE_DURATION} from "../constants/cache"

const fetchCurrencyList = async () => {
  const response = await api.get("/api/v1/currencies");
  return response.data;
};

const Currency = () => {
  const [selectedRecord, setSelectedRecord] = useState(null);

  const {
    data: currencyList = [],
    isLoading,
    error,
  } = useQuery ({
    queryKey: ["currencyList"],
    queryFn: fetchCurrencyList,
    staleTime: CACHE_DURATION,
    refetchOnWindowFocus: true,
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-10">
        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold">CURRENCY LIST</h1>
        </div>

        {error && (
          <div className="mb-4">
            <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded">
              <p className="font-bold">Error Message</p>
              <p className="whitespace-pre-line">{error?.message}</p>
            </div>
          </div>
        )}

        <div className="w-3/4 bg-white shadow rounded">
          {isLoading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : (
            <table className="min-w-full table-fixed text-left border border-gray-300 border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 divide-x divide-gray-300">
                   <th className="py-2 px-4">Currency Id</th>
                  <th className="py-2 px-4">Symbol</th>
                  <th className="py-2 px-4 py-2 px-4 w-[60%]">Description</th>
                </tr>
              </thead>
              <tbody>
                { currencyList.map((item) => {
                  const isSelected = selectedRecord?.id === item.id;

                  return (                             
                        <tr key={item.id} 
                            className={`border-b last:border-b-0 cursor-pointer divide-x divide-gray-300  ${isSelected ? "bg-indigo-100" : ""}`}
                            onClick={() => { setSelectedRecord(item); console.log("Selected Scheme:", item);}}
                        >
                          <td className="py-2 px-4">{item.id}</td>
                          <td className="py-2 px-4">{item.currency}</td>
                          <td className="py-2 px-4">{item.description}</td>
                        </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        
        <hr className="border-t border-grey my-6" />

      </main>
    </div>
  );
}


export default Currency;