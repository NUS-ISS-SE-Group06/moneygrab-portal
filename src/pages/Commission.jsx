import React, {useState } from "react";
import api from "../api/axios";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { CACHE_DURATION } from "../constants/cache";
import CommissionSchemeCreateModal from "../components/Commission/CommissionSchemeCreateModal";
import CommissionSchemeEditModal from "../components/Commission/CommissionSchemeEditModal";
import CommissionRateCreateModal from "../components/Commission/CommissionRateCreateModal"; 
import CommissionRateEditModal from "../components/Commission/CommissionRateEditModal"; 
import CompanyCommissionSchemeCreateModel from "../components/Commission/CompanyCommissionSchemeCreateModal"; 
import CompanyCommissionSchemeEditModel from "../components/Commission/CompanyCommissionSchemeEditModal"; 


const COMMISSION_SCHEME="commissionSchemes";
const COMMISSION_RATE="commissionRates";
const COMPANY_SCHEME="companySchemes";

const fetchSchemes = async () => (await api.get(`/api/v1/schemes`)).data;
const fetchCommissionRates = async (schemeId) => (await api.get(`/api/v1/commission-rates`, { params: { schemeId } })).data;
const fetchCompanySchemes = async (schemeId) => (await api.get(`/api/v1/company-commission-schemes`, { params: { schemeId } })).data;


const deleteScheme = async ({ id, userId }) => await api.delete(`/api/v1/schemes/${id}`, { params: { userId } });
const deleteRate = async ({ id, userId }) => await api.delete(`/api/v1/commission-rates/${id}`, { params: { userId } });
const deleteCompany = async ({ id, userId }) => await api.delete(`/api/v1/company-commission-schemes/${id}`, { params: { userId } });



const Commission = () => {
  const [userId] = useState(1);
  const [selectedRecordScheme, setSelectedRecordScheme] = useState(null);
  const [selectedRecordRate, setSelectedRecordRate] = useState(null);
  const [selectedRecordCompany, setSelectedRecordCompany] = useState(null);

  const [errorScheme, setErrorScheme] = useState(null);
  const [errorRate, setErrorRate] = useState(null);
  const [errorCompany, setErrorCompany] = useState(null);

  const [isCreateModalOpenScheme, setIsCreateModalOpenScheme] = useState(false);
  const [isCreateModalOpenRate, setIsCreateModalOpenRate] = useState(false);
  const [isCreateModalOpenCompany, setIsCreateModalOpenCompany] = useState(false);

  const [isEditModalOpenScheme, setIsEditModalOpenScheme] = useState(false);
  const [isEditModalOpenRate, setIsEditModalOpenRate] = useState(false);
  const [isEditModalOpenCompany, setIsEditModalOpenCompany] = useState(false);

  const queryClient = useQueryClient();

  const { data: commissionSchemes =[], isLoading: isLoadingScheme, error: queryErrorScheme, } = useQuery ( { queryKey: ["commissionSchemes"], queryFn: () => fetchSchemes(), staleTime: CACHE_DURATION, refetchOnWindowFocus: true, });
  const { data: commissionRates = [], isLoading: isLoadingRate, error: queryErrorRate } = useQuery({ queryKey: ["commissionRates", selectedRecordScheme?.id], queryFn: () => fetchCommissionRates(selectedRecordScheme?.id), enabled: !!selectedRecordScheme?.id, staleTime: CACHE_DURATION });
  const { data: companySchemes = [], isLoading: isLoadingCompany, error: queryErrorCompany } = useQuery({ queryKey: ["companySchemes", selectedRecordScheme?.id], queryFn: () => fetchCompanySchemes(selectedRecordScheme?.id), enabled: !!selectedRecordScheme?.id, staleTime: CACHE_DURATION });


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


  //Rate
  const deleteMutationRate = useMutation({
    mutationFn: deleteRate,
    onSuccess: async () => {
      await queryClient.invalidateQueries([COMMISSION_RATE]);
      setSelectedRecordRate(null);
    },
    onError: (err) => {
      const message = err?.response?.data || err?.message || "Failed to delete the form. Please try again.";
      setErrorRate(message);
    },
  });

  const handleOnCreatedRate = async (newData) => {
    await queryClient.invalidateQueries([COMMISSION_RATE]);
    setIsCreateModalOpenRate(false);
  };

  const handleOnUpdatedRate = async (updatedItem) => {
    await queryClient.invalidateQueries([COMMISSION_RATE]);
    setIsEditModalOpenRate(false);
  };

  const handleDeleteRate = async (item) => {
    setErrorRate(null);
    deleteMutationRate.mutate({id: item.id, userId});
  };  


  //CompanyScheme
  const deleteMutationCompany = useMutation({
    mutationFn: deleteCompany,
    onSuccess: async () => {
      await queryClient.invalidateQueries([COMPANY_SCHEME]);
      setSelectedRecordCompany(null);
    },
    onError: (err) => {
      const message = err?.response?.data || err?.message || "Failed to delete the form. Please try again.";
      setErrorCompany(message);
    },
  });

  const handleOnCreatedCompany = async (newData) => {
    await queryClient.invalidateQueries([COMPANY_SCHEME]);
    setIsCreateModalOpenCompany(false);
  };

  const handleOnUpdatedCompany = async (updatedItem) => {
    await queryClient.invalidateQueries([COMPANY_SCHEME]);
    setIsEditModalOpenCompany(false);
  };

  const handleDeleteCompany = async (item) => {
    setErrorCompany(null);
    deleteMutationCompany.mutate({id: item.id, userId});
  };  
  

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-10">
        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold">COMMISSION SCHEME</h1>
          <button 
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded flex items-center font-medium"
            onClick={ () => { setErrorScheme(null); setIsCreateModalOpenScheme(true)}}
          >
            + Create New Scheme
          </button>
        </div>

        {(errorScheme || queryErrorScheme ) && (
          <div className="mb-4">
            <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded">
              <p className="font-bold">Error Message</p>
              <p className="whitespace-pre-line">{errorScheme || queryErrorScheme?.message}</p>
            </div>
          </div>
        )}

        <div className="w-3/4 bg-white shadow rounded">
          {isLoadingScheme ? (
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
                  const isSelected = selectedRecordScheme?.id === item.id;

                  return (                             
                        <tr key={item.id} 
                            className={`border-b last:border-b-0 cursor-pointer divide-x divide-gray-300  ${isSelected ? "bg-indigo-100" : ""}`}
                            onClick={() => { setSelectedRecordScheme(item); console.log("Selected Scheme:", item);}}
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
                              onClick={() => { setIsEditModalOpenScheme(true) }}
                            >
                              Edit
                            </button>
                            <button 
                              className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
                              onClick={() => { handleDeleteScheme(item) }}
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

        {isCreateModalOpenScheme && (
          <CommissionSchemeCreateModal
            onClose={() => setIsCreateModalOpenScheme(false)}
            onCreated={ handleOnCreatedScheme }
          />
        )}

        {isEditModalOpenScheme && (
          <CommissionSchemeEditModal
            selectedRecord={selectedRecordScheme}
            onClose={() => setIsEditModalOpenScheme(false)}
            onUpdated={handleOnUpdatedScheme}
          />
        )}
        
        <hr className="border-t border-grey my-6" />

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold">COMMISSION RATES</h1>
          <button 
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded flex items-center font-medium"
            onClick={()=> { setErrorRate(null); setIsCreateModalOpenRate(true) }}
          >
            + Create New Commision Rate
          </button>
        </div>

        {(errorRate || queryErrorRate) && (
          <div className="mb-4">
            <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded">
              <p className="font-bold">Error Message</p>
              <p className="whitespace-pre-line">{errorRate || queryErrorRate}</p>
            </div>
          </div>
        )}

        <div className="mb-[3mm]">
          <span>Commission Tag: </span>
          <span className="font-bold">{selectedRecordScheme?.nameTag}</span>
        </div>


        <div className="w-3/4 bg-white shadow rounded">
          {isLoadingRate ? (
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
                    const isSelected = selectedRecordRate?.id === item.id;

                    return (  
                            <tr key={item.id} 
                              className={`border-b last:border-b-0 cursor-pointer divide-x divide-gray-300  ${isSelected ? "bg-indigo-100" : ""}`}
                              onClick={() => { setSelectedRecordRate(item); console.log("Selected Commission Rate:", item) }}
                            >
                              <td className="py-2 px-4">{item.currency}</td>
                              <td className="py-2 px-4">{item.rate}</td>
                              <td className="py-2 px-4 flex justify-end gap-2">
                                <button 
                                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
                                  onClick={() => { setIsEditModalOpenRate(true) }}
                                >
                                  Edit
                                </button>
                                <button 
                                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
                                  onClick={() => { handleDeleteRate(item) }}
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

        {isCreateModalOpenRate && (
          <CommissionRateCreateModal
            selectedScheme={selectedRecordScheme}
            onClose={() => { setIsCreateModalOpenRate(false)}}
            onCreated={ handleOnCreatedRate }
          />
        )}

        {isEditModalOpenRate && (
          <CommissionRateEditModal
            selectedRecord={selectedRecordRate}
            onClose={()=> { setIsEditModalOpenRate(false) }}
            onUpdated={ handleOnUpdatedRate }
          />
        )}

       <hr className="border-t border-grey my-6" />

      
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold">COMPANY COMMISSION SCHEME</h1>
          <button 
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded flex items-center font-medium"
            onClick={()=> { setErrorCompany(null); setIsCreateModalOpenCompany(true) }}
          >
            + Set Commision Scheme
          </button>
        </div>

        { (errorCompany || queryErrorCompany) && (
          <div className="mb-4">
            <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded">
              <p className="font-bold">Error Message</p>
              <p className="whitespace-pre-line">{errorCompany || queryErrorCompany?.message }</p>
            </div>
          </div>
        )}

        <div className="mb-[3mm]">
          <span>Commission Tag: </span>
          <span className="font-bold">{selectedRecordScheme?.nameTag}</span>
        </div>
        

        <div className="w-3/4 bg-white shadow rounded">
          {isLoadingCompany ? (
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
                {companySchemes.map((item) => {
                  const isSelected = selectedRecordCompany?.id === item.id;
                  return (
                      <tr key={item.id} 
                        className={`border-b last:border-b-0 cursor-pointer divide-x divide-gray-300  ${isSelected ? "bg-indigo-100" : ""}`}
                        onClick={() => { setSelectedRecordCompany(item); console.log("Selected Company Commission Scheme:", item) }}
                      >
                      <td className="py-2 px-4">{item.companyName}</td>
                      <td className="py-2 px-4">{item.nameTag}</td>
                      <td className="py-2 px-4 flex justify-end gap-2">
                        <button 
                          className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
                          onClick={() => { setIsEditModalOpenCompany(item) }}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
                          onClick={() => { handleDeleteCompany (item) }}
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


        {isCreateModalOpenCompany && (
          <CompanyCommissionSchemeCreateModel
            selectedScheme={selectedRecordScheme}
            onClose={() => { setIsCreateModalOpenCompany(false)}}
            onCreated={ handleOnCreatedCompany }
          />
        )}

        {isEditModalOpenCompany && (
          <CompanyCommissionSchemeEditModel
            selectedRecord={selectedRecordCompany}
            onClose={()=> { setIsEditModalOpenCompany(false) }}
            onUpdated={ handleOnUpdatedCompany }
          />
        )}

      <hr className="border-t border-grey my-6" /> 
      
      </main>
    </div>
  );
}


export default Commission;