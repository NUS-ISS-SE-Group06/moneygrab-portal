import React, {useEffect, useState } from "react";
import api from "../api/axios";

const Currency = () => {
  const [loadingCurrency, setLoadingCurrency] = useState(false);

  const [currencies, setCurrencies] = useState([]);
  const [currencyError, setCurrencyError] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      setLoadingCurrency(true);

      try {
        const response = await api.get("/api/v1/currencies");
        setCurrencies(response.data);
      } catch (err) {
        setCurrencyError("Failed to load currency list. Please try again later.");
        console.error("Currency Error:", err);
      } finally {
        setLoadingCurrency(false);
      }
    };
    fetchData();
  }, []);


  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-10">
        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold">CURRENCY LIST</h1>
        </div>

        {currencyError && (
          <div className="mb-4">
            <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded">
              <p className="font-bold">Error Message</p>
              <p className="whitespace-pre-line">{currencyError}</p>
            </div>
          </div>
        )}

        <div className="w-3/4 bg-white shadow rounded">
          {loadingCurrency ? (
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
                { currencies.map((item) => {
                  const isSelected = selectedCurrency?.id === item.id;

                  return (                             
                        <tr key={item.id} 
                            className={`border-b last:border-b-0 cursor-pointer divide-x divide-gray-300  ${isSelected ? "bg-indigo-100" : ""}`}
                            onClick={() => { setSelectedCurrency(item); console.log("Selected Scheme:", item);}}
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