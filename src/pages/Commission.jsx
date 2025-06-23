import React, {useEffect, useState } from "react";
import api from "../api/axios";
import CommissionSchemeCreateModal from "../components/Commission/CommissionSchemeCreateModal";
import CommissionSchemeEditModal from "../components/Commission/CommissionSchemeEditModal";
import CommissionRateCreateModal from "../components/Commission/CommissionRateCreateModal"; 
import CommissionRateEditModal from "../components/Commission/CommissionRateEditModal"; 
import CompanyCommissionSchemeCreateModel from "../components/Commission/CompanyCommissionSchemeCreateModal"; 
import CompanyCommissionSchemeEditModel from "../components/Commission/CompanyCommissionSchemeEditModal"; 


const Commission = () => {
  const [userId] = useState(1);
  const [loadingScheme, setLoadingSchemes] = useState(false);
  const [loadingCommissionRate, setLoadingRates] = useState(false);
  const [loadingCompanyCommissionScheme, setLoadingCompanySchemes] = useState(false);

  const [commissionSchemes, setCommissionSchemes] = useState([]);
  const [showModalCreateScheme, setshowModalCreateScheme] = useState(false);
  const [showModalEditScheme, setshowModalEditScheme] = useState(false);
  const [schemeError, setSchemeError] = useState(null);
  const [selectedScheme, setselectedScheme] = useState(null);

  const [commissionRates, setCommissionRates] = useState([]);
  const [showModalCreateCommissionRate, setShowModalCreateCommissionRate] = useState(false);
  const [showModalEditCommissionRate, setShowModalEditCommissionRate] = useState(false);
  const [commissionRateError, setCommissionRateError] = useState(null);
  const [selectedCommissionRate, setSelectedCommissionRate] = useState(null);


  const [companyCommissionSchemes, setCompanyCommissionSchemes] = useState([]);
  const [showModalCreateCompanyCommissionScheme, setShowModalCreateCompanyCommissionScheme] = useState(false);
  const [showModalEditCompanyCommissionScheme, setShowModalEditCompanyCommissionScheme] = useState(false);
  const [companyCommissionSchemeError, setCompanyCommissionSchemeError] = useState(null);
  const [selectedCompanyCommissionScheme, setSelectedCompanyCommissionScheme] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingSchemes(true);

      try {
        const response = await api.get("/api/v1/schemes");
        setCommissionSchemes(response.data);
      } catch (err) {
        setSchemeError("Failed to load commission schemes. Please try again later.");
        console.error("Schemes Error:", err);
      } finally {
        setLoadingSchemes(false);
      }
    };
    fetchData();
  }, []);



  useEffect(() => {
    if (!selectedScheme?.id) {
      setCommissionRates([]);
      setCompanyCommissionSchemes([]);
      return;
    }
    fetchCommissionRates(selectedScheme.id);
    fetchCompanyCommissionSchemes(selectedScheme.id);
  }, [selectedScheme]);




  const fetchCommissionRates = async (schemeId) => {
    setLoadingRates(true);
    setCommissionRateError(null);

    try {
      const response = await api.get("/api/v1/commission-rates", {
        params: { schemeId }
      });
      setCommissionRates(response.data);

    } catch (err) {
      setCommissionRateError("Failed to load commission rates. Please try again later.");
      console.error("Commission Rate Error:", err);

    } finally {
      setLoadingRates(false);
    }
  };

  const fetchCompanyCommissionSchemes = async (schemeId) => {
    setLoadingCompanySchemes(true);
    setCompanyCommissionSchemeError(null);

    try {
      const response = await api.get("/api/v1/company-commission-schemes", {
        params: { schemeId }
      });
      setCompanyCommissionSchemes(response.data);
    } catch (err) {
      setCompanyCommissionSchemeError("Failed to load company commission scheme. Please try again later.");
      console.error("Company Commission Scheme Error:", err);
    } finally {
      setLoadingCompanySchemes(false);
    }
  };


  // Commission Scheme Handlers
  const applyUpdatedScheme = (updatedItem) => {
    setCommissionSchemes((prevItems) =>
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

  const handleCommissionSchemeDelete = async (item) => {
    setSchemeError(null);

    try {
      await api.delete(`/api/v1/schemes/${item.id}`, {
        params: {
          userId
        }
      });
      setCommissionSchemes((prev) =>
        prev.filter((entry) => entry.id !== item.id)
      );

      setselectedScheme(null);

    } catch (err) {
      console.error(err);

      const message =
        err?.response?.data ||
        err?.message ||
        "Failed to delete the form. Please try again.";

      setSchemeError(message);
    }
  };  

  // Commission Rates Handlers  
  const ApplyUpdatedCommissionRate = (updatedItem) => {
    setCommissionRates((prevItems) =>
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


  const handleCommissionRateDelete = async (item) => {
    setCommissionRateError(null);
    try {
      await api.delete(`/api/v1/commission-rates/${item.id}`, {
        params: {
          userId
        }
      });
      setCommissionRates((prev) =>
        prev.filter((entry) => entry.id !== item.id)
      );
    } catch (err) {
      console.error(err);

      const message =
        err?.response?.data ||
        err?.message ||
        "Failed to delete the form. Please try again.";
      
      setCommissionRateError(message);
    }

  }; 

  
  // Company Commission Scheme Handlers
  const ApplyUpdatedCompanyCommissionScheme = (updatedItem) => {
    setCompanyCommissionSchemes((prevItems) =>
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

const handleDeleteCompanyCommissionScheme = async (item) => {
    setCompanyCommissionSchemeError(null);

    try {
      await api.delete(`/api/v1/company-commission-schemes/${item.id}`, {
        params: {
          userId
        }
      });
      setCompanyCommissionSchemes((prev) =>
        prev.filter((entry) => entry.id !== item.id)
      );

      setSelectedCompanyCommissionScheme(null);

    } catch (err) {
      console.error(err);

      const message =
        err?.response?.data ||
        err?.message ||
        "Failed to delete the form. Please try again.";

      setCompanyCommissionSchemeError(message);
    }
  };  




  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-10">
        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold">COMMISSION SCHEME</h1>
          <button 
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded flex items-center font-medium"
            onClick={ () => { setSchemeError(null); setshowModalCreateScheme(true)}}
          >
            + Create New Scheme
          </button>
        </div>

        {schemeError && (
          <div className="mb-4">
            <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded">
              <p className="font-bold">Error Message</p>
              <p className="whitespace-pre-line">{schemeError}</p>
            </div>
          </div>
        )}

        <div className="w-3/4 bg-white shadow rounded">
          {loadingScheme ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : (
            <table className="min-w-full table-fixed text-left border border-gray-300 border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 divide-x divide-gray-300">
                  <th className="py-2 px-4">Commission Tag</th>
                  <th className="py-2 px-4 py-2 px-4 w-[60%]">Description</th>
                  <th className="py-2 px-4 text-center w-20">Default</th>
                  <th className="py-2 px-4 text-center w-20"></th>
                </tr>
              </thead>
              <tbody>
                { commissionSchemes.map((item) => {
                  const isSelected = selectedScheme?.id === item.id;

                  return (                             
                        <tr key={item.id} 
                            className={`border-b last:border-b-0 cursor-pointer divide-x divide-gray-300  ${isSelected ? "bg-indigo-100" : ""}`}
                            onClick={() => { setselectedScheme(item); console.log("Selected Scheme:", item);}}
                        >
                          <td className="py-2 px-4">{item.nameTag}</td>
                          <td className="py-2 px-4">{item.description}</td>
                          <td className="py-2 px-4">
                            <input
                              type="checkbox"
                              checked={item.isDefault}
                              readOnly
                              className="cursor-default"
                            />
                          </td>
                          <td className="py-2 px-4 flex justify-end gap-2">
                            <button 
                              className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
                              onClick={() => { setshowModalEditScheme(true) }}
                            >
                              Edit
                            </button>
                            <button 
                              className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
                              onClick={() => { handleCommissionSchemeDelete(item) }}
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

        {showModalCreateScheme && (
          <CommissionSchemeCreateModal
            onClose={() => setshowModalCreateScheme(false)}
            onCreated={ (newData) => {setCommissionSchemes((prevData) => [...prevData, newData]) }}
          />
        )}

        {showModalEditScheme && (
          <CommissionSchemeEditModal
            selectedScheme={selectedScheme}
            onClose={() => setshowModalEditScheme(false)}
            onUpdated={applyUpdatedScheme}
          />
        )}
        
        <hr className="border-t border-grey my-6" />
       
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold">COMMISSION RATES</h1>
          <button 
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded flex items-center font-medium"
            onClick={()=> { setCommissionRateError(null); setShowModalCreateCommissionRate(true) }}
          >
            + Create New Commision Rate
          </button>
        </div>

        {commissionRateError && (
          <div className="mb-4">
            <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded">
              <p className="font-bold">Error Message</p>
              <p className="whitespace-pre-line">{commissionRateError}</p>
            </div>
          </div>
        )}

        <div className="mb-[3mm]">
          <span>Commission Tag: </span>
          <span className="font-bold">{selectedScheme?.nameTag}</span>
        </div>


        <div className="w-3/4 bg-white shadow rounded">
          {loadingCommissionRate ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : (
            <table className="min-w-full table-fixed text-left border border-gray-300 border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 divide-x divide-gray-300">
                  <th className="py-2 px-4">Symbol</th>
                  <th className="py-2 px-4">Commission Rates</th>
                  <th className="py-2 px-4 text-center w-20"></th>
                </tr>
              </thead>
              <tbody>
                  { commissionRates.map((item) => {
                    const isSelected = selectedCommissionRate?.id === item.id;

                    return (  
                            <tr key={item.id} 
                              className={`border-b last:border-b-0 cursor-pointer divide-x divide-gray-300  ${isSelected ? "bg-indigo-100" : ""}`}
                              onClick={() => { setSelectedCommissionRate(item); console.log("Selected Commission Rate:", item) }}
                            >
                              <td className="py-2 px-4">{item.currency}</td>
                              <td className="py-2 px-4">{item.rate}</td>
                              <td className="py-2 px-4 flex justify-end gap-2">
                                <button 
                                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
                                  onClick={() => { setShowModalEditCommissionRate(true) }}
                                >
                                  Edit
                                </button>
                                <button 
                                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
                                  onClick={() => { handleCommissionRateDelete(item) }}
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

        {showModalCreateCommissionRate && (
          <CommissionRateCreateModal
            selectedScheme={selectedScheme}
            onClose={() => { setShowModalCreateCommissionRate(false)}}
            onCreated={(newData)=> { setCommissionRates((prevData) => [...prevData, newData]) }}
          />
        )}

        {showModalEditCommissionRate && (
          <CommissionRateEditModal
            selectedCommissionRate={selectedCommissionRate}
            onClose={()=> { setShowModalEditCommissionRate(false) }}
            onUpdated={ApplyUpdatedCommissionRate}
          />
        )}

       <hr className="border-t border-grey my-6" />


        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold">COMPANY COMMISSION SCHEME</h1>
          <button 
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded flex items-center font-medium"
            onClick={()=> { setCompanyCommissionSchemeError(null); setShowModalCreateCompanyCommissionScheme(true) }}
          >
            + Set Commision Scheme
          </button>
        </div>

        {companyCommissionSchemeError && (
          <div className="mb-4">
            <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded">
              <p className="font-bold">Error Message</p>
              <p className="whitespace-pre-line">{companyCommissionSchemeError}</p>
            </div>
          </div>
        )}

        <div className="mb-[3mm]">
          <span>Commission Tag: </span>
          <span className="font-bold">{selectedScheme?.nameTag}</span>
        </div>
        

        <div className="w-3/4 bg-white shadow rounded">
          {loadingCompanyCommissionScheme ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : (
            <table className="min-w-full table-fixed text-left border border-gray-300 border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 divide-x divide-gray-300">
                  <th className="py-2 px-4">Money Changer</th>
                  <th className="py-2 px-4">Commission Tag</th>
                  <th className="py-2 px-4 text-center w-20"></th>
                </tr>
              </thead>
              <tbody>
                {companyCommissionSchemes.map((item) => {
                  const isSelected = selectedCompanyCommissionScheme?.id === item.id;
                  return (
                      <tr key={item.id} 
                        className={`border-b last:border-b-0 cursor-pointer divide-x divide-gray-300  ${isSelected ? "bg-indigo-100" : ""}`}
                        onClick={() => { setSelectedCompanyCommissionScheme(item); console.log("Selected Company Commission Scheme:", item) }}
                      >
                      <td className="py-2 px-4">{item.companyName}</td>
                      <td className="py-2 px-4">{item.nameTag}</td>
                      <td className="py-2 px-4 flex justify-end gap-2">
                        <button 
                          className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
                          onClick={() => { setShowModalEditCompanyCommissionScheme(item) }}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
                          onClick={() => { 
                              handleDeleteCompanyCommissionScheme(item)
                          }}
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


        {showModalCreateCompanyCommissionScheme && (
          <CompanyCommissionSchemeCreateModel
            selectedScheme={selectedScheme}
            onClose={() => { setShowModalCreateCompanyCommissionScheme(false)}}
            onCreated={(newData)=> { setCompanyCommissionSchemes((prevData) => [...prevData, newData]) }}
          />
        )}

        {showModalEditCompanyCommissionScheme && (
          <CompanyCommissionSchemeEditModel
            selectedCompanyCommissionScheme={selectedCompanyCommissionScheme}
            onClose={()=> { setShowModalEditCompanyCommissionScheme(false) }}
            onUpdated={ApplyUpdatedCompanyCommissionScheme}
          />
        )}

      <hr className="border-t border-grey my-6" />
      
      </main>
    </div>
  );
}


export default Commission;