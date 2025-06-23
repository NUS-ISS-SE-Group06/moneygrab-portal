import React, {useEffect, useState } from "react";
import api from "../api/axios";
import ManageCurrencyCodeCreateModal from "../components/Currency/ManageCurrencyCodeCreateModal";
import ManageCurrencyCodeEditModal from "../components/Currency/ManageCurrencyCodeEditModal";

const ManageCurrency = () => {
  const [userId] = useState(1);
  const [moneyChanger]= useState({id: 1, companyName: "Company 1"});
  const [loadingMoneyChangerCurrencies, setLoadingMoneyChangerCurrencies] = useState(false);
  const [moneyChangerCurrencies, setMoneyChangerCurrencies] = useState([]);
  const [showModalCreateMoneyChangerCurrency, setShowModalCreateMoneyChangerCurrency] = useState(false);
  const [showModalEditMoneyChangerCurrency, setShowModalEditMoneyChangerCurrency] = useState(false);
  const [moneyChangerCurrencyError, setMoneyChangerCurrencyError] = useState(null);
  const [selectedMoneyChangerCurrency, setSelectedMoneyChangerCurrency] = useState(null);

  useEffect(() => {
    if (!moneyChanger?.id) return;
    
    const fetchData = async () => {
      setLoadingMoneyChangerCurrencies(true);
      try {
        const response = await api.get("/api/v1/money-changers-currencies", {
          params: {
            moneyChangerId: moneyChanger?.id
          }
        });
        setMoneyChangerCurrencies(response.data);
      } catch (err) {
        setMoneyChangerCurrencyError("Failed to load money changer currency. Please try again later.");
        console.error("Money Changer Currency Error:", err);
      } finally {
        setLoadingMoneyChangerCurrencies(false);
      }
    };
    fetchData();
  }, [moneyChanger?.id]);


  // Money Changer Currecy Handlers
  const applyUpdateMoneyChangerCurrency = (updatedItem) => {
    setMoneyChangerCurrencies((prevItems) =>
      prevItems.map((item) => {
        if (item.id === updatedItem.id) {
          return updatedItem;
        }
        if (updatedItem.isDefault) {
          return { ...item, isDefault: false };
        }
        return item;
      })
    );
  };

  const handleMoneyChangerCurrencyDelete = async (item) => {
    setMoneyChangerCurrencyError(null);

    try {
      await api.delete(`/api/v1/money-changers-currencies/${item.id}`, {
        params: {
          userId
        }
      });
      setMoneyChangerCurrencies((prev) =>
        prev.filter((entry) => entry.id !== item.id)
      );

      setSelectedMoneyChangerCurrency(null);

    } catch (err) {
      console.error(err);

      const message =
        err?.response?.data ||
        err?.message ||
        "Failed to delete the form. Please try again.";

      setMoneyChangerCurrencyError(message);
    }
  };  



  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-10">
        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold">MANAGE CURRENCY CODES</h1>
          <button 
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded flex items-center font-medium"
            onClick={ () => { setMoneyChangerCurrencyError(null); setShowModalCreateMoneyChangerCurrency(true)}}
          >
            + Set New Currency Code
          </button>
        </div>

        {moneyChangerCurrencyError && (
          <div className="mb-4">
            <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded">
              <p className="font-bold">Error Message</p>
              <p className="whitespace-pre-line">{moneyChangerCurrencyError}</p>
            </div>
          </div>
        )}

        <div className="mb-[3mm]">
          <span>Money Changer: </span>
          <span className="font-bold">{moneyChanger?.companyName}</span>
        </div>

        <div className="w-3/4 bg-white shadow rounded">
          {loadingMoneyChangerCurrencies ? (
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
                  const isSelected = selectedMoneyChangerCurrency?.id === item.id;

                  return (                             
                        <tr key={item.id} 
                            className={`border-b last:border-b-0 cursor-pointer divide-x divide-gray-300  ${isSelected ? "bg-indigo-100" : ""}`}
                            onClick={() => { setSelectedMoneyChangerCurrency(item); console.log("Selected Scheme:", item);}}
                        >
                          <td className="py-2 px-4">{item.currency}</td>
                          <td className="py-2 px-4">{item.currencyDescription}</td>
                          <td className="py-2 px-4 flex justify-end gap-2">
                            <button 
                              className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
                              onClick={() => { setShowModalEditMoneyChangerCurrency(true) }}
                            >
                              Edit
                            </button>
                            <button 
                              className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
                              onClick={() => { handleMoneyChangerCurrencyDelete(item) }}
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

        {showModalCreateMoneyChangerCurrency && (
          <ManageCurrencyCodeCreateModal
            moneychanger={moneyChanger}
            onClose={() => setShowModalCreateMoneyChangerCurrency(false)}
            onCreated={ (newData) => {setMoneyChangerCurrencies((prevData) => [...prevData, newData]) }}
          />
        )}

        {showModalEditMoneyChangerCurrency && (
          <ManageCurrencyCodeEditModal
            selected={selectedMoneyChangerCurrency}
            onClose={() => setShowModalEditMoneyChangerCurrency(false)}
            onUpdated={applyUpdateMoneyChangerCurrency}
          />
        )}
        
        <hr className="border-t border-grey my-6" />
       


      </main>
    </div>
  );
}


export default ManageCurrency;