import React, { useState, useEffect, useCallback } from "react";
import CreateMoneyChangerModal from "./CreateMoneyChangerModal";
import EditMoneyChangerModal from "./EditMoneyChangerModal";
import api from "../../api/axios";
import PropTypes from "prop-types";

const MoneyChangerList = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [moneyChangers, setMoneyChangers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchMoneyChangers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/api/v1/money-changers");
      if (!response.data) {
        throw new Error("No data received from API");
      }
      setMoneyChangers(response.data);
      setError(null);
    } catch (err) {
      setError(`Failed to fetch money changers: ${err.message}`);
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMoneyChangers();
  }, [fetchMoneyChangers, refreshTrigger]);

  const handleSaveAccount = (newData) => {
    if (!newData.email || !newData.companyName) {
      setError("Company Name and Email are required.");
      return;
    }
    setError(null);
    setRefreshTrigger((prev) => prev + 1);
    setShowCreate(false);
  };

  const handleUpdate = (updatedRow) => {
    setMoneyChangers((prev) =>
      prev.map((row) => (row.id === updatedRow.id ? updatedRow : row))
    );
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this money changer?")) {
      try {
        const response = await api.delete(`/api/v1/money-changers/${id}`);
        if (response.status !== 200 && response.status !== 204) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log(`Deleted money changer with id: ${id}`);
        setRefreshTrigger((prev) => prev + 1);
      } catch (err) {
        setError(`Failed to delete: ${err.message}`);
        console.error("Delete error:", err);
      }
    }
  };

  const handleModalClose = (success) => {
    if (success) {
      setRefreshTrigger((prev) => prev + 1);
    }
    setShowEdit(false);
    setSelectedRow(null);
  };

  const dismissBanner = () => {
    setError(null);
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading money changers...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {error && (
        <div className="bg-yellow-100 text-red-700 p-4 mb-4 flex justify-between items-center rounded">
          <span>{error}</span>
          <button
            onClick={dismissBanner}
            className="ml-4 text-red-700 hover:text-red-900"
          >
            Dismiss
          </button>
        </div>
      )}
      <h2 className="text-2xl font-bold mb-4">Manage Money Changers</h2>
      <div className="flex justify-end mb-4">
        <button
          className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          onClick={() => setShowCreate(true)}
        >
          + Create New Money Changer
        </button>
      </div>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Id</th>
            <th className="p-2 text-left">Company Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">UEN No</th>
            <th className="p-2 text-left">Date of Incorporation</th>
            <th className="p-2 text-left">Scheme</th>
            <th className="p-2 text-left">Country</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {moneyChangers.map((row) => (
            <tr key={row.id} className="border-t">
              <td className="p-2">{row.id}</td>
              <td className="p-2">{row.companyName}</td>
              <td className="p-2">{row.email}</td>
              <td className="p-2">{row.uen}</td>
              <td className="p-2">{row.dateOfIncorporation}</td>
              <td className="p-2">{`Scheme-${row.schemeId}`}</td>
              <td className="p-2">{row.country}</td>
              <td className="p-2">
                <button
                  className="bg-indigo-500 text-white px-3 py-1 rounded mr-2 hover:bg-indigo-600"
                  onClick={() => {
                    setSelectedRow(row);
                    setShowEdit(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => handleDelete(row.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showCreate && (
        <ModalOverlay>
          <CreateMoneyChangerModal
            onClose={() => setShowCreate(false)}
            onSave={handleSaveAccount}
          />
        </ModalOverlay>
      )}

      {showEdit && selectedRow && (
        <ModalOverlay>
          <EditMoneyChangerModal
            data={selectedRow}
            onClose={handleModalClose}
            onUpdate={handleUpdate}
          />
        </ModalOverlay>
      )}
    </div>
  );
};

// ModalOverlay component with PropTypes
export function ModalOverlay({ children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      {children}
    </div>
  );
}

ModalOverlay.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MoneyChangerList;