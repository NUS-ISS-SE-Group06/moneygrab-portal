import React, {useEffect, useState } from "react";
import api from "../api/axios";
import CommissionSchemeCreateModal from "../components/CommissionSchemeCreateModal";
import CommissionSchemeEditModal from "../components/CommissionSchemeEditModal";
import CommissionRateCreateModal from "../components/CommissionRateCreateModal"; 
import CommissionRateEditModal from "../components/CommissionRateEditModal"; 


const Commission = () => {
  const [userId] = useState(1);
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
      setLoadingCompanySchemes(true);
   
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
    const fetchCommissionRates = async () => {
      if (!selectedCommissionScheme?.id) {
        setCommissionRates([]);
        setCompanyCommissionSchemes([]);
        return;
      }

      setLoadingRates(true);
      setLoadingCompanySchemes(true);
      setCommissionRateError(null);
      setCompanyCommissionSchemeError(null);

      try {
        const response = await api.get("/api/v1/commission-rates",{
          params: {
            schemeId: selectedCommissionScheme?.id
          }
        });

        setCommissionRates(response.data);
      } catch (err) {
        setCommissionRateError("Failed to load commission rates. Please try again later.");
        console.error("Commission Rate Error:", err);
      } finally {
        setLoadingRates(false);
      }


      try {
        const response = await api.get("/api/v1/company-commission-schemes");
        setCompanyCommissionSchemes(response.data);
      } catch (err) {
        setCompanyCommissionSchemeError("Failed to load company commission scheme. Please try again later.");
        console.error("Company Commission Scheme Error:", err);
      } finally {
        setLoadingCompanySchemes(false);
      }
    };

    fetchCommissionRates();
  }, [selectedCommissionScheme]);

  // Commission Scheme Handlers
  const applyUpdatedScheme = (updated) => {
    setCommissionSchemes((prev) =>
      prev.map((s) => {
        if (s.id === updated.id) {
          return updated;
        }
        if (updated.isDefault) {
          return { ...s, isDefault: false };
        }
        return s;
      })
    );
  };

  const handleCommissionSchemeDelete = async (id) => {
    setSchemeError(null);

    try {
      await api.delete(`/api/v1/schemes/${id}`, {
        params: {
          userId
        }
      });
        setCommissionSchemes((prev) =>
        prev.filter((item) => item.id !== id)
      );

      setSelectedCommissionScheme(null);

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
  const ApplyUpdatedCommissionRate = (updated) => {
    setCommissionRates((prev) =>
      prev.map((s) => {
        if (s.id === updated.id) {
          return updated;
        }
        if (updated.isDefault) {
          return { ...s, isDefault: false };
        }
        return s;
      })
    );
  };



  const handleCommissionRateDelete = async (id) => {
    setCommissionRateError(null);
    try {
      await api.delete(`/api/v1/commission-rates/${id}`, {
        params: {
          userId
        }
      });

      setCommissionRates((prev) =>
        prev.filter((item) => item.id !== id)
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
  // TO DO: TO BE DELETED

     const handleCloseCreateCompanyCommissionSchemeModal = () => {
      //setShowModalCreateCompanyCommissionScheme(false);
    };

    const handleOpenEditCompanyCommissionSchemeModal = (scheme) => {
      //setShowModalEditCompanyCommissionScheme(true);
    };

    const handleCloseEditCompanyCommissionSchemeModal = () => {
      //setShowModalEditCompanyCommissionScheme(false);
    };  

    const handleRowClickCompanyCommissionScheme = (company) => {
      //setSelectedCompanyCommissionScheme(company);
      //console.log("Selected company:", company);
    }

    const handleCompanyCommissionSchemeCreated = (newCompany) => {

      //setCommissionSchemes((prevCompany) => [...prevCompany, newCompany]);
    };

    const handleCompanyCommissionSchemeUpdated = (updatedCompany) => {
      /*
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
      */
    };

    const handleDeleteCompanyCommissionScheme = async (id) => {
      /*try {
        await api.delete(`/api/v1/company-commission-scheme/${id}`);
        setCompanyCommissionSchemes((prevCompany) =>
          prevCompany.filter((company) => company.id !== id)
        );
      } catch (err) {
        setSchemeError("Failed to delete scheme. Please try again later.");
        console.error("Failed to delete scheme:", err);
      } */
    };  


  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-10">
        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold">COMMISSION SCHEME</h1>
          <button 
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded flex items-center font-medium"
            onClick={ () => { setSchemeError(null); setShowModalCreateCommissionScheme(true)}}
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
                            onClick={() => { setSelectedCommissionScheme(scheme); console.log("Selected scheme:", scheme);}}
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
                              onClick={() => { setShowModalEditCommissionScheme(true) }}
                            >
                              Edit
                            </button>
                            <button 
                              className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
                              onClick={() => { handleCommissionSchemeDelete(scheme.id) }}
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
            onClose={() => setShowModalCreateCommissionScheme(false)}
            onCreated={ (newScheme) => {setCommissionSchemes((prevSchemes) => [...prevSchemes, newScheme]) }}
          />
        )}

        {showModalEditCommissionScheme && (
          <CommissionSchemeEditModal
            scheme={selectedCommissionScheme}
            onClose={() => setShowModalEditCommissionScheme(false)}
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
                              onClick={() => { setSelectedCommissionRate(rate); console.log("Selected rate:", rate) }}
                            >
                              <td className="py-2 px-4">{rate.currency}</td>
                              <td className="py-2 px-4">{rate.rate}</td>
                              <td className="py-2 px-4 flex justify-end gap-2">
                                <button 
                                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
                                  onClick={() => { setShowModalEditCommissionRate(true) }}
                                >
                                  Edit
                                </button>
                                <button 
                                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
                                  onClick={() => { handleCommissionRateDelete(rate.id) }}
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
            selectedScheme={selectedCommissionScheme}
            onClose={() => { setShowModalCreateCommissionRate(false)}}
            onCreated={(newRate)=> { setCommissionRates((prevRates) => [...prevRates, newRate]) }}
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
          <span className="font-bold">{selectedCommissionScheme?.nameTag}</span>
        </div>
        

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