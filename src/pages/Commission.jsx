import React, { use, useEffect, useState } from "react";
import api from "../api/axios";
import Sidebar from "../components/sidebar";
import CommissionSchemeCreateModal from "../components/CommissionSchemeCreateModal";
import CommissionSchemeEditModal from "../components/CommissionSchemeEditModal";

const Commission = () => {
  const [loadingSchemes, setLoadingSchemes] = useState(false);
  const [loadingRates, setLoadingRates] = useState(false);
  const [loadingCompanySchemes, setLoadingCompanySchemes] = useState(false);

  const [commissionSchemes, setCommissionSchemes] = useState([]);
  const [showModalCreateCommissionScheme, setShowModalCreateCommissionScheme] = useState(false);
  const [showModalEditCommissionScheme, setShowModalEditCommissionScheme] = useState(false);
  const [schemeError, setSchemeError] = useState(null);
  const [selectedCommissionScheme, setSelectedCommissionScheme] = useState(null);

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
      setLoadingRates(true);
      setLoadingCompanySchemes(true);
   
      try {
        const schemesResponse = await api.get("/api/v1/schemes");
        setCommissionSchemes(schemesResponse.data);
      } catch (err) {
        setSchemeError("Failed to load commission schemes. Please try again later.");
        console.error("Schemes Error:", err);
      } finally {
        setLoadingSchemes(false);
      }


      try {
        const commissionRateResponse = await api.get("/api/v1/commission-rates");
        setCommissionRates(commissionRateResponse.data);
      } catch (err) {
        setCommissionRateError("Failed to load commission rates. Please try again later.");
        console.error("Commission Rate Error:", err);
      } finally {
        setLoadingRates(false);
      }

       try {
        const companyCommissionSchemeResponse = await api.get("/api/v1/company-commission-schemes");
        setCompanyCommissionSchemes(companyCommissionSchemeResponse.data);
      } catch (err) {
        setCompanyCommissionSchemeError("Failed to load company commission scheme. Please try again later.");
        console.error("Company Commission Scheme Error:", err);
      } finally {
        setLoadingCompanySchemes(false);
      }


    };

    fetchData();
  }, []);

    // Commission Scheme Handlers
    const handleOpenCreateSchemeModal = () => {
      setSchemeError(null);
      setShowModalCreateCommissionScheme(true)
    };

    const handleCloseCreateSchemeModal = () => {
      setShowModalCreateCommissionScheme(false);
    };

    const handleOpenEditSchemeModal = (scheme) => {
      setShowModalEditCommissionScheme(true);
    };

    const handleCloseEditSchemeModal = () => {
      setShowModalEditCommissionScheme(false);
    };  

    const handleRowClickScheme = (scheme) => {
      setSelectedCommissionScheme(scheme);
      console.log("Selected scheme:", scheme);
    }

    const handleSchemeCreated = (newScheme) => {
      setCommissionSchemes((prevSchemes) => [...prevSchemes, newScheme]);
    };

    const handleSchemeUpdated = (updatedScheme) => {
      setCommissionSchemes((prev) =>
        prev.map((s) => {
          if (s.id === updatedScheme.id) {
            return updatedScheme;
          }
          if (updatedScheme.isDefault) {
            // Unset isDefault for all others
            return { ...s, isDefault: false };
          }
          return s;
        })
      );
    };

    const handleDeleteCommissionScheme = async (id) => {
      try {
        await api.delete(`/api/v1/schemes/${id}`);
        setCommissionSchemes((prevSchemes) =>
          prevSchemes.filter((scheme) => scheme.id !== id)
        );
      } catch (err) {
        console.error("Failed to delete scheme:", err);
        setSchemeError("Failed to delete scheme. Please try again later.");
      }
    };  

  // Commission Rates Handlers
    const handleOpenCreateCommissionRateModal = () => {
      setCommissionRateError(null);
      setShowModalCreateCommissionRate(true)
    };

    const handleCloseCreateCommissionRateModal = () => {
      setShowModalCreateCommissionRate(false);
    };

    const handleOpenEditCommissionRateModal = (scheme) => {
      setShowModalEditCommissionRate(true);
    };

    const handleCloseEditCommissionRateModal = () => {
      setShowModalEditCommissionRate(false);
    }; 

    const handleRowClickCommissionRate = (rate) => {
      setSelectedCommissionRate(rate);
      console.log("Selected scheme:", rate);
    }

    const handleCommissionRateCreated = (newRate) => {
      setCommissionRates((prevRates) => [...prevRates, newRate]);
    };
    
    const handleDeleteCommissionRate = async (id) => {
      try {
        await api.delete(`/api/v1/commission-rates/${id}`);
        setCommissionRates((prevRates) =>
          prevRates.filter((rate) => rate.id !== id)
        );
      } catch (err) {
        console.error("Failed to delete rate:", err);
        setSchemeError("Failed to delete rate. Please try again later.");
      }
    };  

    const handleCommissionRateUpdated = (updatedRate) => {
      setCommissionSchemes((prev) =>
        prev.map((s) => {
          if (s.id === updatedRate.id) {
            return updatedRate;
          }
          if (updatedRate.isDefault) {
            // Unset isDefault for all others
            return { ...s, isDefault: false };
          }
          return s;
        })
      );
    };

  
  // Company Commission Scheme Handlers
    const handleOpenCreateCompanyCommissionSchemeModal = () => {
      setCompanyCommissionSchemeError(null);
      setShowModalCreateCompanyCommissionScheme(true)
    };

    const handleCloseCreateCompanyCommissionSchemeModal = () => {
      setShowModalCreateCompanyCommissionScheme(false);
    };

    const handleOpenEditCompanyCommissionSchemeModal = (scheme) => {
      setShowModalEditCompanyCommissionScheme(true);
    };

    const handleCloseEditCompanyCommissionSchemeModal = () => {
      setShowModalEditCompanyCommissionScheme(false);
    };  

    const handleRowClickCompanyCommissionScheme = (company) => {
      setSelectedCompanyCommissionScheme(company);
      console.log("Selected company:", company);
    }

    const handleCompanyCommissionSchemeCreated = (newCompany) => {
      setCommissionSchemes((prevCompany) => [...prevCompany, newCompany]);
    };

    const handleCompanyCommissionSchemeUpdated = (updatedCompany) => {
      setCommissionSchemes((prev) =>
        prev.map((s) => {
          if (s.id === updatedCompany.id) {
            return updatedCompany;
          }
          if (updatedCompany.isDefault) {
            // Unset isDefault for all others
            return { ...s, isDefault: false };
          }
          return s;
        })
      );
    };

    const handleDeleteCompanyCommissionScheme = async (id) => {
      try {
        await api.delete(`/api/v1/company-commission-scheme/${id}`);
        setCompanyCommissionSchemes((prevCompany) =>
          prevCompany.filter((company) => company.id !== id)
        );
      } catch (err) {
        console.error("Failed to delete scheme:", err);
        setSchemeError("Failed to delete scheme. Please try again later.");
      }
    };  



  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-10">
        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold">COMMISSION SCHEME</h1>
          <button 
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded flex items-center font-medium"
            onClick={handleOpenCreateSchemeModal}
          >
            + Create New Scheme
          </button>
        </div>

        {schemeError && (
          <div className="mb-4">
            <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded">
              <p className="font-bold">Error Message</p>
              <p>{schemeError}</p>
            </div>
          </div>
        )}

        <div className="bg-white shadow rounded">
          {loadingSchemes ? (
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
                { commissionSchemes.map((scheme) => {
                  const isSelected = selectedCommissionScheme?.id === scheme.id;

                  return (                             
                        <tr key={scheme.id} 
                            className={`border-b last:border-b-0 cursor-pointer divide-x divide-gray-300  ${isSelected ? "bg-indigo-100" : ""}`}
                            onClick={() => handleRowClickScheme(scheme)}
                        >
                          <td className="py-2 px-4">{scheme.nameTag}</td>
                          <td className="py-2 px-4">{scheme.description}</td>
                          <td className="py-2 px-4">
                            <input
                              type="checkbox"
                              checked={scheme.isDefault}
                              readOnly
                              className="cursor-default"
                            />
                          </td>
                          <td className="py-2 px-4 flex justify-end gap-2">
                            <button 
                              className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
                              onClick={() => {
                                handleOpenEditSchemeModal(scheme)
                              }}
                            >
                              Edit
                            </button>
                            <button 
                              className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
                              onClick={() => { 
                                handleDeleteCommissionScheme(scheme.id)
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

        {showModalCreateCommissionScheme && (
          <CommissionSchemeCreateModal
            onClose={handleCloseCreateSchemeModal}
            onCreated={handleSchemeCreated}
          />
        )}

        {showModalEditCommissionScheme && (
          <CommissionSchemeEditModal
            scheme={selectedCommissionScheme}
            onClose={handleCloseEditSchemeModal}
            onUpdated={handleSchemeUpdated}
          />
        )}
        
        <hr className="border-t border-grey my-6" />
       
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold">COMMISSION RATES</h1>
          <button 
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded flex items-center font-medium"
            onClick={handleOpenCreateCommissionRateModal}
          >
            + Create New Commision Rate
          </button>
        </div>

        {commissionRateError && (
          <div className="mb-4">
            <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded">
              <p className="font-bold">Error Message</p>
              <p>{commissionRateError}</p>
            </div>
          </div>
        )}

        <div className="mb-[3mm]">
          <span>Commission Tag: </span>
          <span className="font-bold">{selectedCommissionScheme?.nameTag}</span>
        </div>


        <div className="bg-white shadow rounded">
          {loadingRates ? (
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
                  { commissionRates.map((rate) => {
                    const isSelected = selectedCommissionRate?.id === rate.id;

                    return (  
                            <tr key={rate.id} 
                              className={`border-b last:border-b-0 cursor-pointer divide-x divide-gray-300  ${isSelected ? "bg-indigo-100" : ""}`}
                              onClick={() => handleRowClickCommissionRate(rate)}
                            >
                              <td className="py-2 px-4">{rate.currency}</td>
                              <td className="py-2 px-4">{rate.rate}</td>
                              <td className="py-2 px-4 flex justify-end gap-2">
                                <button 
                                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
                                  onClick={() => {
                                      handleOpenEditCommissionRateModal(rate)
                                  }}
                                >
                                  Edit
                                </button>
                                <button 
                                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
                                  onClick={() => { 
                                      handleDeleteCommissionRate(rate.id)
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

        {showModalCreateCommissionRate && (
          <CommissionSchemeCreateModal
            onClose={handleCloseCreateCommissionRateModal}
            onCreated={handleCommissionRateCreated}
          />
        )}

        {showModalEditCommissionRate && (
          <CommissionSchemeEditModal
            scheme={selectedCommissionRate}
            onClose={handleCloseEditCommissionRateModal}
            onUpdated={handleCommissionRateUpdated}
          />
        )}

       <hr className="border-t border-grey my-6" />


        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold">COMPANY COMMISSION SCHEME</h1>
          <button 
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded flex items-center font-medium"
            onClick={handleOpenCreateCompanyCommissionSchemeModal}
          >
            + Set Commision Scheme
          </button>
        </div>

        {companyCommissionSchemeError && (
          <div className="mb-4">
            <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded">
              <p className="font-bold">Error Message</p>
              <p>{companyCommissionSchemeError}</p>
            </div>
          </div>
        )}
        

        <div className="bg-white shadow rounded">
          {loadingCompanySchemes ? (
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
                {companyCommissionSchemes.map((company) => {
                  const isSelected = selectedCompanyCommissionScheme?.id === company.id;
                  return (
                      <tr key={company.id} 
                        className={`border-b last:border-b-0 cursor-pointer divide-x divide-gray-300  ${isSelected ? "bg-indigo-100" : ""}`}
                        onClick={() => handleRowClickCompanyCommissionScheme(company)}
                      >
                      <td className="py-2 px-4">{company.moneychanger}</td>
                      <td className="py-2 px-4">{company.commissiontag}</td>
                      <td className="py-2 px-4 flex justify-end gap-2">
                        <button 
                          className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
                          onClick={() => {
                              handleOpenEditCompanyCommissionSchemeModal(company)
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
                          onClick={() => { 
                              handleDeleteCompanyCommissionScheme(company.id)
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


      </main>
    </div>
  );
}


export default Commission;